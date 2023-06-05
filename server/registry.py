class Registry:

    def __init__(self, name) -> None:
        self._name = name
        self._registry = dict()

    def register_node(self, type, sub_type='', force=False):
        key = '{}:{}'.format(type, sub_type)
        if key in self._registry and not force:
            raise Exception('{} is already in registry'.format(key))
        else:

            def _register(node):
                self._registry[key] = node

            return _register

    def run(self, node, input):
        type = node.type
        sub_type = getattr(node, 'sub_type', '')
        key = '{}:{}'.format(type, sub_type)
        if key not in self._registry:
            raise Exception('can not find node with type:{}'.format(
                type, sub_type))
        else:
            return self._registry[key](node)(node, input)
