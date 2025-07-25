
import json
import re
from functools import partial
from typing import Any
import pandas as pd
from api.db import LLMType
from api.db.services.conversation_service import structure_answer
from api.db.services.llm_service import LLMBundle
from api import settings
from agent.component.base import ComponentBase, ComponentParamBase
from plugin import GlobalPluginManager
from plugin.llm_tool_plugin import llm_tool_metadata_to_openai_tool
from rag.llm.chat_model import ToolCallSession
from rag.prompts import message_fit_in


class LLMToolPluginCallSession(ToolCallSession):
    def tool_call(self, name: str, arguments: dict[str, Any]) -> str:
        tool = GlobalPluginManager.get_llm_tool_by_name(name)

        if tool is None:
            raise ValueError(f"LLM tool {name} does not exist")

        return tool().invoke(**arguments)


class GenerateParam(ComponentParamBase):
    """
    Define the Generate component parameters.
    """

    def __init__(self):
        super().__init__()
        self.llm_id = ""
        self.prompt = ""
        self.max_tokens = 0
        self.temperature = 0
        self.top_p = 0
        self.presence_penalty = 0
        self.frequency_penalty = 0
        self.cite = True
        self.parameters = []
        self.llm_enabled_tools = []

    def check(self):
        self.check_decimal_float(self.temperature, "[Generate] Temperature")
        self.check_decimal_float(self.presence_penalty, "[Generate] Presence penalty")
        self.check_decimal_float(self.frequency_penalty, "[Generate] Frequency penalty")
        self.check_nonnegative_number(self.max_tokens, "[Generate] Max tokens")
        self.check_decimal_float(self.top_p, "[Generate] Top P")
        self.check_empty(self.llm_id, "[Generate] LLM")
        # self.check_defined_type(self.parameters, "Parameters", ["list"])

    def gen_conf(self):
        conf = {}
        if self.max_tokens > 0:
            conf["max_tokens"] = self.max_tokens
        if self.temperature > 0:
            conf["temperature"] = self.temperature
        if self.top_p > 0:
            conf["top_p"] = self.top_p
        if self.presence_penalty > 0:
            conf["presence_penalty"] = self.presence_penalty
        if self.frequency_penalty > 0:
            conf["frequency_penalty"] = self.frequency_penalty
        return conf


class Generate(ComponentBase):
    component_name = "Generate"

    def get_dependent_components(self):
        inputs = self.get_input_elements()
        cpnts = set([i["key"] for i in inputs[1:] if i["key"].lower().find("answer") < 0 and i["key"].lower().find("begin") < 0])
        return list(cpnts)

    def set_cite(self, retrieval_res, answer):
        if "empty_response" in retrieval_res.columns:
            retrieval_res["empty_response"].fillna("", inplace=True)
        chunks = json.loads(retrieval_res["chunks"][0])
        answer, idx = settings.retrievaler.insert_citations(answer,
                                                            [ck["content_ltks"] for ck in chunks],
                                                            [ck["vector"] for ck in chunks],
                                                            LLMBundle(self._canvas.get_tenant_id(), LLMType.EMBEDDING,
                                                                      self._canvas.get_embedding_model()), tkweight=0.7,
                                                            vtweight=0.3)
        doc_ids = set([])
        recall_docs = []
        for i in idx:
            did = chunks[int(i)]["doc_id"]
            if did in doc_ids:
                continue
            doc_ids.add(did)
            recall_docs.append({"doc_id": did, "doc_name": chunks[int(i)]["docnm_kwd"]})

        for c in chunks:
            del c["vector"]
            del c["content_ltks"]

        reference = {
            "chunks": chunks,
            "doc_aggs": recall_docs
        }

        if answer.lower().find("invalid key") >= 0 or answer.lower().find("invalid api") >= 0:
            answer += " Please set LLM API-Key in 'User Setting -> Model providers -> API-Key'"
        res = {"content": answer, "reference": reference}
        res = structure_answer(None, res, "", "")

        return res

    def get_input_elements(self):
        key_set = set([])
        res = [{"key": "user", "name": "Input your question here:"}]
        for r in re.finditer(r"\{([a-z]+[:@][a-z0-9_-]+)\}", self._param.prompt, flags=re.IGNORECASE):
            cpn_id = r.group(1)
            if cpn_id in key_set:
                continue
            if cpn_id.lower().find("begin@") == 0:
                cpn_id, key = cpn_id.split("@")
                for p in self._canvas.get_component(cpn_id)["obj"]._param.query:
                    if p["key"] != key:
                        continue
                    res.append({"key": r.group(1), "name": p["name"]})
                    key_set.add(r.group(1))
                continue
            cpn_nm = self._canvas.get_component_name(cpn_id)
            if not cpn_nm:
                continue
            res.append({"key": cpn_id, "name": cpn_nm})
            key_set.add(cpn_id)
        return res

    def _run(self, history, **kwargs):
        chat_mdl = LLMBundle(self._canvas.get_tenant_id(), LLMType.CHAT, self._param.llm_id)

        if len(self._param.llm_enabled_tools) > 0:
            tools = GlobalPluginManager.get_llm_tools_by_names(self._param.llm_enabled_tools)

            chat_mdl.bind_tools(
                LLMToolPluginCallSession(),
                [llm_tool_metadata_to_openai_tool(t.get_metadata()) for t in tools]
            )

        prompt = self._param.prompt

        retrieval_res = []
        self._param.inputs = []
        for para in self.get_input_elements()[1:]:
            if para["key"].lower().find("begin@") == 0:
                cpn_id, key = para["key"].split("@")
                for p in self._canvas.get_component(cpn_id)["obj"]._param.query:
                    if p["key"] == key:
                        kwargs[para["key"]] = p.get("value", "")
                        self._param.inputs.append(
                            {"component_id": para["key"], "content": kwargs[para["key"]]})
                        break
                else:
                    assert False, f"Can't find parameter '{key}' for {cpn_id}"
                continue

            component_id = para["key"]
            cpn = self._canvas.get_component(component_id)["obj"]
            if cpn.component_name.lower() == "answer":
                hist = self._canvas.get_history(1)
                if hist:
                    hist = hist[0]["content"]
                else:
                    hist = ""
                kwargs[para["key"]] = hist
                continue
            _, out = cpn.output(allow_partial=False)
            if "content" not in out.columns:
                kwargs[para["key"]] = ""
            else:
                if cpn.component_name.lower() == "retrieval":
                    retrieval_res.append(out)
                kwargs[para["key"]] = "  - " + "\n - ".join([o if isinstance(o, str) else str(o) for o in out["content"]])
            self._param.inputs.append({"component_id": para["key"], "content": kwargs[para["key"]]})

        if retrieval_res:
            retrieval_res = pd.concat(retrieval_res, ignore_index=True)
        else:
            retrieval_res = pd.DataFrame([])

        for n, v in kwargs.items():
            prompt = re.sub(r"\{%s\}" % re.escape(n), str(v).replace("\\", " "), prompt)

        if not self._param.inputs and prompt.find("{input}") >= 0:
            retrieval_res = self.get_input()
            input = ("  - " + "\n  - ".join(
                [c for c in retrieval_res["content"] if isinstance(c, str)])) if "content" in retrieval_res else ""
            prompt = re.sub(r"\{input\}", re.escape(input), prompt)

        downstreams = self._canvas.get_component(self._id)["downstream"]
        if kwargs.get("stream") and len(downstreams) == 1 and self._canvas.get_component(downstreams[0])[
            "obj"].component_name.lower() == "answer":
            return partial(self.stream_output, chat_mdl, prompt, retrieval_res)

        if "empty_response" in retrieval_res.columns and not "".join(retrieval_res["content"]):
            empty_res = "\n- ".join([str(t) for t in retrieval_res["empty_response"] if str(t)])
            res = {"content": empty_res if empty_res else "Nothing found in knowledgebase!", "reference": []}
            return pd.DataFrame([res])

        msg = self._canvas.get_history(self._param.message_history_window_size)
        if len(msg) < 1:
            msg.append({"role": "user", "content": "Output: "})
        _, msg = message_fit_in([{"role": "system", "content": prompt}, *msg], int(chat_mdl.max_length * 0.97))
        if len(msg) < 2:
            msg.append({"role": "user", "content": "Output: "})
        ans = chat_mdl.chat(msg[0]["content"], msg[1:], self._param.gen_conf())
        ans = re.sub(r"^.*</think>", "", ans, flags=re.DOTALL)
        self._canvas.set_component_infor(self._id, {"prompt":msg[0]["content"],"messages":  msg[1:],"conf":  self._param.gen_conf()})
        if self._param.cite and "chunks" in retrieval_res.columns:
            res = self.set_cite(retrieval_res, ans)
            return pd.DataFrame([res])

        return Generate.be_output(ans)

    def stream_output(self, chat_mdl, prompt, retrieval_res):
        res = None
        if "empty_response" in retrieval_res.columns and not "".join(retrieval_res["content"]):
            empty_res = "\n- ".join([str(t) for t in retrieval_res["empty_response"] if str(t)])
            res = {"content": empty_res if empty_res else "Nothing found in knowledgebase!", "reference": []}
            yield res
            self.set_output(res)
            return

        msg = self._canvas.get_history(self._param.message_history_window_size)
        if msg and msg[0]['role'] == 'assistant':
            msg.pop(0)
        if len(msg) < 1:
            msg.append({"role": "user", "content": "Output: "})
        _, msg = message_fit_in([{"role": "system", "content": prompt}, *msg], int(chat_mdl.max_length * 0.97))
        if len(msg) < 2:
            msg.append({"role": "user", "content": "Output: "})
        answer = ""
        for ans in chat_mdl.chat_streamly(msg[0]["content"], msg[1:], self._param.gen_conf()):
            res = {"content": ans, "reference": []}
            answer = ans
            yield res

        if self._param.cite and "chunks" in retrieval_res.columns:
            res = self.set_cite(retrieval_res, answer)
            yield res
        self._canvas.set_component_infor(self._id, {"prompt":msg[0]["content"],"messages":  msg[1:],"conf":  self._param.gen_conf()})
        self.set_output(Generate.be_output(res))

    def debug(self, **kwargs):
        chat_mdl = LLMBundle(self._canvas.get_tenant_id(), LLMType.CHAT, self._param.llm_id)
        prompt = self._param.prompt

        for para in self._param.debug_inputs:
            kwargs[para["key"]] = para.get("value", "")

        for n, v in kwargs.items():
            prompt = re.sub(r"\{%s\}" % re.escape(n), str(v).replace("\\", " "), prompt)

        u = kwargs.get("user")
        ans = chat_mdl.chat(prompt, [{"role": "user", "content": u if u else "Output: "}], self._param.gen_conf())
        return pd.DataFrame([ans])
