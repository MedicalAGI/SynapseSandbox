import glob
import os
import argparse

import yaml
from promptsource.templates import DatasetTemplates
import jinja2schema


def parge_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('root', type=str)
    return parser.parse_args()


def valid(template_str):
    try:
        vars = jinja2schema.infer(template_str.split('|||')[0])
        is_plain = True
        for v_name in vars.keys():
            if not isinstance(vars[v_name], jinja2schema.model.Scalar):
                is_plain = False
                break
        num_var_level1 = len(vars.keys())
        if is_plain and num_var_level1 == 1:
            return True
    except:
        return False


def main(args):
    yaml_files = list(
        glob.glob('{}/**/templates.yaml'.format(args.root), recursive=True))

    for path in yaml_files:
        yaml_dict = yaml.load(open(path, "r"), Loader=yaml.FullLoader)
        templates = yaml_dict['templates']
        _templates = dict()
        for T_name in templates:
            T = templates[T_name]
            if valid(T.jinja):
                _templates[T_name] = T
        if len(_templates) == 0:
            os.remove(path)
        else:
            yaml_dict['templates'] = _templates
            with open(path, 'wt') as fw:
                yaml.dump(yaml_dict, fw)


if __name__ == '__main__':
    main(parge_args())