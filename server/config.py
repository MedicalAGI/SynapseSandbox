from easydict import EasyDict

CFG = EasyDict()
CFG.PROMPT_TEMPLATES_ROOT = 'resources/prompt_templates'
CFG.TEMPLATE_FILENAME = 'templates.yaml'
CFG.TFSERVER_URLs = {
    'default': [
        'http://127.0.0.1:{}/v1/models/PromptDdemo:predict'.format(7001 +
                                                                   _ * 100)
        for _ in range(2)
    ],
    'tinylm': [
        'http://127.0.0.1:{}/v1/models/PromptDdemo:predict'.format(8001 +
                                                                   _ * 100)
        for _ in range(2)
    ]
}
CFG.QA_DATABASE_ROOT = 'resources/qa_database'
CFG.TFSERVER_BATCH_SIZE = 2
CFG.FLOW_RESULTS_CACHE_SIZE = 1024
CFG.FLOW_THREAD_POOL_SIZE = 10
CFG.QA_SEARCH_CACHE_SIZE = 1024
