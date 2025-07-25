
import logging
import re
from abc import ABC
from api.db import LLMType
from api.db.services.llm_service import LLMBundle
from agent.component import GenerateParam, Generate


class KeywordExtractParam(GenerateParam):
    """
    Define the KeywordExtract component parameters.
    """

    def __init__(self):
        super().__init__()
        self.top_n = 1

    def check(self):
        super().check()
        self.check_positive_integer(self.top_n, "Top N")

    def get_prompt(self):
        self.prompt = """
- Role: You're a question analyzer. 
- Requirements: 
  - Summarize user's question, and give top %s important keyword/phrase.
  - Use comma as a delimiter to separate keywords/phrases.
- Answer format: (in language of user's question)
  - keyword: 
""" % self.top_n
        return self.prompt


class KeywordExtract(Generate, ABC):
    component_name = "KeywordExtract"

    def _run(self, history, **kwargs):
        query = self.get_input()
        if hasattr(query, "to_dict") and "content" in query:
            query = ", ".join(map(str, query["content"].dropna()))
        else:
            query = str(query)


        chat_mdl = LLMBundle(self._canvas.get_tenant_id(), LLMType.CHAT, self._param.llm_id)
        self._canvas.set_component_infor(self._id, {"prompt":self._param.get_prompt(),"messages":  [{"role": "user", "content": query}],"conf": self._param.gen_conf()})

        ans = chat_mdl.chat(self._param.get_prompt(), [{"role": "user", "content": query}],
                            self._param.gen_conf())

        ans = re.sub(r"^.*</think>", "", ans, flags=re.DOTALL)
        ans = re.sub(r".*keyword:", "", ans).strip()
        logging.debug(f"ans: {ans}")
        return KeywordExtract.be_output(ans)

    def debug(self, **kwargs):
        return self._run([], **kwargs)
