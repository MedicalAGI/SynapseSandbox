BASEDIR="$(cd "$(dirname "$0")"; pwd)"
DEVICE=${DEVICE:-"CPU"}
NUM_REPLICA=${NUM_REPLICA:-2}
NUM_REPLICA=$((NUM_REPLICA - 1))
NUM_GPU=${NUM_GPU:-2}
GPU_ID_START=${GPU_ID_START:-0}


if [[ $DEVICE = "GPU" ]]; then
    DEVICE="--runtime=nvidia"
else
    DEVICE=""
fi

for idx in $(seq 0 $NUM_REPLICA); do
    gpu_id=$((GPU_ID_START + idx % NUM_GPU))
    port1=$((8000 + 100 * idx))
    port2=$((port1 + 1))
    docker run --rm \
        ${DEVICE} \
        -e CUDA_VISIBLE_DEVICES=$gpu_id \
        -e TF_FORCE_GPU_ALLOW_GROWTH=true \
        -v ${BASEDIR}:/models \
        -p ${port1}:8500 -p ${port2}:8501  tensorflow/serving:latest-gpu  \
        --model_config_file=/models/models.config \
        --enable_batching \
        --batching_parameters_file=/models/batch.config &
done

# curl -d '{"instances": ["hello, are you ok"]}' -X POST http://127.0.0.1:9501/v1/models/PromptDdemo:predict
