from typing import List, Union
from io import StringIO

from pydantic import BaseModel, Extra
import yaml
import promptsource

from .nodes import NODES
from .config import CFG


class Node(BaseModel):
    name: str
    type: str
    template: Union[str, None] = None
    input: Union[str, None] = None
    valid_range: Union[List[Union[int, float]], None] = None
    valid_value: Union[List, None] = None
    database1: Union[str, None] = None
    database2: Union[str, None] = None
    threshold: Union[float, None] = None
    llm: Union[str, None] = None

    @property
    def prompt(self) -> int:
        if self.template is not None:
            if getattr(self, '_prompt', None) is None:
                prompt = yaml.load(StringIO(self.template),
                                   Loader=yaml.FullLoader)
                setattr(self, '_prompt', prompt)
                return prompt
            else:
                return self._prompt
        else:
            return None

    class Config:
        extra = Extra.allow


class Flow(BaseModel):
    flow_id: str
    nodes: List[Node]


def _run_flow(flow: Flow):
    stop_flag = False
    flow_outputs = [flow.nodes[0].input]
    node_infos = list()
    try:
        for idx, node in enumerate(flow.nodes, 1):
            rst = NODES.run(node, flow_outputs[-1])
            rst.update({
                'node_index': idx,
                'node_name': node.name,
                'node_input': flow_outputs[-1]
            })
            node_infos.append(rst)
            if node.type in ['process', 'search']:
                flow_outputs.append(rst['output'])
            if rst.get('stop', False):
                stop_flag = True
                break
        if stop_flag:
            flow_rst = flow_outputs[-2] if len(
                flow_outputs) >= 2 else flow_outputs[-1]
        else:
            flow_rst = flow_outputs[-1]
        result = {
            'flow_rst': flow_rst,
            'node_infos': node_infos,
            'stop_flag': stop_flag,
            'stop_node_index': idx,
        }
    except Exception as e:
        result = {'error': True, 'error_message': str(e)}
    CFG.FLOW_RESULTS_CACHE[flow.flow_id] = result


def run_flow(flow: Flow):
    if flow.flow_id not in CFG.FLOW_RESULTS_CACHE:
        CFG.FLOW_RESULTS_CACHE[flow.flow_id] = {'running': True}
        CFG.FLOW_THREAD_POOL.submit(_run_flow, flow)
    return CFG.FLOW_RESULTS_CACHE[flow.flow_id]