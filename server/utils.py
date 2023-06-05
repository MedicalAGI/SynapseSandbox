from typing import List
import requests
import random

from jinja2 import Environment, BaseLoader
from jinja2.compiler import CodeGenerator

from .config import CFG


class TrackingCodeGenerator(CodeGenerator):
    """We abuse the code generator for introspection."""

    def __init__(self, environment: "Environment") -> None:
        super().__init__(environment, "<introspection>", "<introspection>")
        self.undeclared_identifiers: List[str] = list()

    def write(self, x: str) -> None:
        """Don't write."""

    def enter_frame(self, frame) -> None:
        """Remember all undeclared identifiers."""
        super().enter_frame(frame)

        for _, (action, param) in frame.symbols.loads.items():
            if action == "resolve" and param not in self.environment.globals:
                self.undeclared_identifiers.append(param)


def parse_variable_from_prompt_template(template):
    env = Environment(loader=BaseLoader)
    ast = env.parse(template)
    codegen = TrackingCodeGenerator(ast.environment)  # type: ignore
    codegen.visit(ast)
    return codegen.undeclared_identifiers


def call_tfserving(json_reqs, llm='default', sync=True):

    def _call_tfserving(req, url):
        rsp = requests.post(url, json=req)
        return rsp

    tfserver_urls = CFG.TFSERVER_URLs[llm]
    if len(json_reqs) == 1:
        url = tfserver_urls[random.randint(0, len(tfserver_urls) - 1)]
        return [_call_tfserving(json_reqs[0], url)]
    else:
        results = list()
        for idx, req in enumerate(json_reqs):
            url = tfserver_urls[idx % len(tfserver_urls)]
            future = CFG.TFSERVER_THREAD_POOL.submit(_call_tfserving, req, url)
            results.append(future)
        if sync:
            return [_.result() for _ in results]
        else:
            return results
