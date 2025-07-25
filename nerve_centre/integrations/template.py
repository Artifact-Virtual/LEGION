
import json
import re

from jinja2 import StrictUndefined
from jinja2.sandbox import SandboxedEnvironment

from agent.component.base import ComponentBase, ComponentParamBase


class TemplateParam(ComponentParamBase):
    """
    Define the Generate component parameters.
    """

    def __init__(self):
        super().__init__()
        self.content = ""
        self.parameters = []

    def check(self):
        self.check_empty(self.content, "[Template] Content")
        return True


class Template(ComponentBase):
    component_name = "Template"

    def get_dependent_components(self):
        inputs = self.get_input_elements()
        cpnts = set([i["key"] for i in inputs if i["key"].lower().find("answer") < 0 and i["key"].lower().find("begin") < 0])
        return list(cpnts)

    def get_input_elements(self):
        key_set = set([])
        res = []
        for r in re.finditer(r"\{([a-z]+[:@][a-z0-9_-]+)\}", self._param.content, flags=re.IGNORECASE):
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
        content = self._param.content

        self._param.inputs = []
        for para in self.get_input_elements():
            if para["key"].lower().find("begin@") == 0:
                cpn_id, key = para["key"].split("@")
                for p in self._canvas.get_component(cpn_id)["obj"]._param.query:
                    if p["key"] == key:
                        value = p.get("value", "")
                        self.make_kwargs(para, kwargs, value)
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
                self.make_kwargs(para, kwargs, hist)
                continue

            _, out = cpn.output(allow_partial=False)

            result = ""
            if "content" in out.columns:
                result = "\n".join([o if isinstance(o, str) else str(o) for o in out["content"]])

            self.make_kwargs(para, kwargs, result)

        env = SandboxedEnvironment(
            autoescape=True,
            undefined=StrictUndefined,
        )
        template = env.from_string(content)

        try:
            content = template.render(kwargs)
        except Exception:
            pass

        for n, v in kwargs.items():
            if not isinstance(v, str):
                try:
                    v = json.dumps(v, ensure_ascii=False)
                except Exception:
                    pass
            # Process backslashes in strings, Use Lambda function to avoid escape issues
            if isinstance(v, str):
                v = v.replace("\\", "\\\\")
            content = re.sub(r"\{%s\}" % re.escape(n), lambda match: v, content)
            content = re.sub(r"(#+)", r" \1 ", content)

        return Template.be_output(content)

    def make_kwargs(self, para, kwargs, value):
        self._param.inputs.append({"component_id": para["key"], "content": value})
        try:
            value = json.loads(value)
        except Exception:
            pass
        kwargs[para["key"]] = value
