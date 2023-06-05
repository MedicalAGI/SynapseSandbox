import os
import glob
from pathlib import Path
from functools import lru_cache

import yaml
from promptsource.templates import DatasetTemplates


@lru_cache()
def load_templates(root, TEMPLATE_FILENAME):
    paths = glob.glob(os.path.join(root, '**', TEMPLATE_FILENAME),
                      recursive=True)
    start_part = len(Path(root).parts)
    template_rst = {}
    option_rst = []
    part_index = {}
    for path in sorted(paths, key=lambda x: x.lower()):
        dataset_path = list(Path(path).parts[start_part:-1])
        option_rst_node = option_rst
        part_index_node = part_index
        for part in dataset_path:
            if part not in part_index_node:
                option_rst_node.append({
                    "label": part,
                    "value": part,
                    "children": [],
                })
                part_index_node[part] = {0: len(option_rst_node) - 1}
            option_rst_node = option_rst_node[part_index_node[part]
                                              [0]]["children"]
            part_index_node = part_index_node[part]
        with open(path, 'r') as fr:
            yaml_dict = yaml.load(fr, Loader=yaml.FullLoader)
        prompts = list(yaml_dict['templates'].values())
        for prompt in prompts:
            template_rst[os.path.join(*dataset_path, prompt.name)] = yaml.dump(
                prompt, allow_unicode='utf-8')
            option_rst_node.append({
                "label": prompt.name,
                "value": prompt.name,
            })
    return {
        "template": template_rst,
        "option": option_rst,
    }


if __name__ == '__main__':
    from server.config import CFG
    load_templates(CFG.PROMPT_TEMPLATES_ROOT, CFG.TEMPLATE_FILENAME)
