# Prompt Synapse
[./logo.jpg]
## TFServing
```bash
# start tfserving
DEVICE=GPU NUM_REPLICA=2 NUM_GPU=2 GPU_ID_START=6 ./run.sh
# stop tfserving
./resources/tfserving/stop.sh

```

## Run server
```bash
# start prompt flow server
./run.sh
```

## Run client
```bash
python client.py
```

## GUI Client develop

```bash
# dev
cd client
yarn & yarn dev
# dev environment: localhost:4203
```

```bash
# build
cd client
rm -rf dist
yarn & yarn build
rm -rf ../static
cp -r dist ../static
```
