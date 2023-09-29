# counter
Scaling with Kubernetes exercise

## CLI Commands

```bash

# after installing minikube & kubectl
# start a cluster
$ minikube start

# start a new terminal, and leave this running
$ minikube dashboard

# build the main app image 
$ cd visit-counter-app/ && minikube image build -t visit-counter-app -f ./Dockerfile .

# check available minikube; ensure that docker.io/library/hello-minikube-app:latest is present in the list
$ minikube image list

# deploy the app
$ kubectl apply -f kubernetes/visit-counter-app-deployment.yaml 

# check current deployment
$ kubectl get deployments

# list the pods
$ kubectl get pods
# output
# visit-counter-app-deployment-67cdb798bd-d9n7w

# check the logs of the pods e.g
$ kubectl logs visit-counter-app-deployment-67cdb798bd-d9n7w
# e.g output
# Listening on http://localhost:7777/

# deploy the services and exposing the application
$ kubectl apply -f kubernetes/visit-counter-app-service.yaml 

# check services
$ kubectl get services

# access the application
$ minikube service visit-counter-app-service --url
# check the url e.g http://127.0.0.1:52140

# cleaning up; delete services and deployment
$ kubectl delete -f kubernetes/visit-counter-app-service.yaml && kubectl delete -f kubernetes/visit-counter-app-deployment.yaml 

# delete minikube
$ minikube delete

# clean slate
$ minikube delete && docker system prune -a && docker images prune -a && docker volume prune -a

# to restart
$ minikube start

# restart service abd deployment
$ kubectl apply -f kubernetes/visit-counter-app-deployment.yaml,kubernetes/visit-counter-app-service.yaml

# list pods
$ kubectl get pods

# check url
$ minikube service visit-counter-app-service --url
# e.g http://127.0.0.1:52223

# add 4 instance of cpu's (remove first the existing minikube cluster)
$ minikube start --cpus 4

# enable metric server
$ minikube addons enable metrics-server

# The following configuration adds a resource request for 100m CPU units per container (0.1 CPU units) and limits the 
# resource usage to 200m CPU units per container (0.2 CPU units).

# check if addon is running
$ minikube addons list

# check the resource usage of the pods
$ kubectl top pod

# autoscaling policy where the minimum number of replicas is 1, the maximum number of replicas is 5, and the target average CPU utilization is 5%.
# In production, the target would likely be somewhere around 50-75% CPU utilization
$ kubectl autoscale -f kubernetes/visit-counter-app-deployment.yaml --min=1 --max=5 --cpu-percent=5

# list available scaling deployments
$ kubectl get hpa
# e.g http://127.0.0.1:52522

# testing automatic scaling
$ minikube service visit-counter-app-service --url
# run k6 for testing
$ k6 run k6-tests/k6-test.js
# check the increase of the pods
$ kubectl get hpa

# cleanup autoscaling config to configure auto scaling on visit-counter-app-deployment-hpa.yaml
$ kubectl delete hpa visit-counter-app-deployment

# run hpa autoscaling
$ kubectl apply -f kubernetes/visit-counter-app-deployment-hpa.yaml 
# check auto scaling config status

# database scaling with PostgreSQL operator CloudNativePG

# install first the operator
$ kubectl apply -f https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/release-1.19/releases/cnpg-1.19.1.yaml

# peek at using kubectl get all -n cnpg-system
$ kubectl get all -n cnpg-system

# deploy a cluster
$ kubectl apply -f kubernetes/visit-counter-app-database-cluster.yaml

# describe the secrets created for the database cluster
# secrets are injected into our containers as environment variables
$ kubectl describe secret visit-counter-app-database-cluster

# when the database cluster is created, a username called "app" is created for the cluster; the name of the DB cluster followed by the suffix -app
$ kubectl describe secret visit-counter-app-database-cluster-app

# peeking into service
$ kubectl get services

# build DB migration image with the name:  visit-counter-app-database-migrations
$ cd flyway/ && minikube image build -t visit-counter-app-database-migrations -f ./Dockerfile .

# list the image; ensure the visit-counter-app-database-migrations:latest is present
$ minikube image list 

# apply flyway migrations
$ kubectl apply -f kubernetes/visit-counter-app-database-migration-job.yaml
# check if jobs is completed
$ kubectl get pods
# To run a new migration, remove the old job, and run the kubectl apply command again

## deployment config; after editing app.js
$ cd visit-counter-app/ && minikube image build -t visit-counter-app -f ./Dockerfile .
$ cd .. && kubectl apply -f kubernetes/visit-counter-app-deployment.yaml 
# checks pods
$ kubectl get pods

# make a sample query or check the endpoints
$ minikube service visit-counter-app-service --url
```