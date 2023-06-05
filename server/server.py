import os
import json
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import pylru

from .config import CFG
from .load_templates import load_templates
from .flow import Flow, run_flow

app = FastAPI()


@app.on_event("startup")
async def startup_event():
    # load QA Databases
    CFG.QA_DATABASES = dict()
    for name in os.listdir(CFG.QA_DATABASE_ROOT):
        with open(os.path.join(CFG.QA_DATABASE_ROOT, name)) as fr:
            db = json.load(fr)
            CFG.QA_DATABASES[Path(name).stem] = db
    # create LRU cache for flow results
    CFG.FLOW_RESULTS_CACHE = pylru.lrucache(CFG.FLOW_RESULTS_CACHE_SIZE)
    # creat thread pool
    CFG.FLOW_THREAD_POOL = ThreadPoolExecutor(
        max_workers=CFG.FLOW_THREAD_POOL_SIZE)
    CFG.TFSERVER_THREAD_POOL = ThreadPoolExecutor(
        max_workers=min([len(CFG.TFSERVER_URLs[k])
                         for k in CFG.TFSERVER_URLs]))
    # create LRU cache for search results
    CFG.QA_SEARCH_CACHE = pylru.lrucache(CFG.QA_SEARCH_CACHE_SIZE)


@app.get("/")
def index():
    return FileResponse('static/index.html')


@app.get("/{filename}")
def index(filename):
    if filename == 'dashboard':
        filename = 'index.html'
    return FileResponse('static/{}'.format(filename))


@app.get("/api/get_templates")
def get_templates():
    return load_templates(CFG.PROMPT_TEMPLATES_ROOT, CFG.TEMPLATE_FILENAME)


@app.post("/api/run_flow")
async def run(flow: Flow):
    return run_flow(flow)