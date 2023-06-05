# step 1
bash tf_serving_docker_establish.sh

# step 2
DEVICE=GPU NUM_REPLICA=2 NUM_GPU=2 GPU_ID_START=6 ./run.sh
