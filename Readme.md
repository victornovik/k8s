# Kubernetes

## Installation

**Install `kubectl`**
- [Install and Set Up kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/)

```powershell
curl.exe -LO "https://dl.k8s.io/release/v1.34.0/bin/windows/amd64/kubectl.exe"
kubectl version --client
```

**Install `minukube`**
- [Install and Set Up minikube](https://minikube.sigs.k8s.io/docs/start/?arch=%2Fwindows%2Fx86-64%2Fstable%2F.exe+download)

```powershell
winget install Kubernetes.minikube
```

**Install `nginx` container in order to verify Docker desktop**
```powershell
docker run -p 8080:80 -d nginx
```

## Create K8s cluster

**🚀 Start `minikube` cluster in Docker**
```powershell
minikube start --driver=docker
minikube status
```

**Access just launched `minikube` cluster by kubectl**
```powershell
kubectl cluster-info
kubectl get nodes
kubectl get pods
kubectl get namespaces
```

**See pods of the master node (the same as worker node since we've got single-node cluster)**
```powershell
kubectl get pods --namespace=kube-system
```

**Connect to k8s node by SSH and see Docker containers running inside `minikube` Docker container**
```powershell
minikube ssh
docker@minikube:~$ docker ps
docker@minikube:~$ docker version
exit
```

```panel
Docker version used inside k8s nodes is different than the Docker version on our computer
```

**Create pod `nginx-pod` with 1 container**
> **K8s cluster -> nodes -> pods -> 1 container (typically 1 pod runs 1 container)**
```powershell
kubectl run nginx-pod --image=nginx
kubectl get pods -o wide
kubectl describe pod nginx-pod
```

```panel
Pay attention this pod actually contains 2 containers
 - One container `k8s_nginx-pod_nginx-pod_default_xxx` runs `nginx`.
 - Another auxilliary one `k8s_POD_nginx-pod_default_xxx` contains pod resources reserved for the first container.
```

```powershell
minikube ssh
# We can reach internal 10.244.0.3 only inside 'minikube' node. We cannot ping it from outside.
docker@minikube:~$ ping 10.244.0.3
docker@minikube:~$ curl 10.244.0.3
docker@minikube:~$ docker ps | grep nginx
```

**Connect to internal `nginx` container created inside `minicube` node and execute UNIX commands inside it**
```powershell
docker exec -it bb49069b770c sh
hostname
hostname -I
exit
exit
```

**Delete `nginx-pod` pod**
```powershell
kubectl delete pod nginx-pod
kubectl get pods -o wide
```

## Create K8s deployment

**Create `nginx-deploy` deployment consisting of 1 pod**
```powershell
kubectl create deployment nginx-deploy --image=nginx
kubectl get pods -o wide
kubectl describe deployment nginx-deploy
```

```panel
NewReplicaSet:   nginx-deploy-6f47956ff4 (1/1 replicas created)
Replicas: 1 desired | 1 updated | 1 total | 1 available | 0 unavailable
```

**Change number of pods in `nginx-deploy` deployment**
```powershell
kubectl scale deployment nginx-deploy --replicas=5
kubectl get pods -o wide
kubectl describe deployment nginx-deploy
```

```panel
NewReplicaSet:   nginx-deploy-6f47956ff4 (5/5 replicas created)
Replicas: 5 desired | 5 updated | 5 total | 5 available | 0 unavailable
NAME                            READY   STATUS    RESTARTS   AGE   IP           NODE
nginx-deploy-6f47956ff4-285f9   1/1     Running   0          56s   10.244.0.8   minikube
nginx-deploy-6f47956ff4-gzwz2   1/1     Running   0          56s   10.244.0.9   minikube
nginx-deploy-6f47956ff4-kfn2k   1/1     Running   0          29m   10.244.0.5   minikube
nginx-deploy-6f47956ff4-mfdr2   1/1     Running   0          56s   10.244.0.6   minikube
nginx-deploy-6f47956ff4-qnczz   1/1     Running   0          56s   10.244.0.7   minikube
```

**Connect to any pod inside `minikube` cluster**
```powershell
minikube ssh
# We can reach internal 10.244.0.5 only inside 'minikube' node. We cannot ping it from outside.
docker@minikube:~$ ping 10.244.0.5
docker@minikube:~$ curl 10.244.0.5
```

## Create `ClusterIP` service
**Create service available only inside cluster and balancing requests among pods**
```powershell
kubectl expose deployment nginx-deploy --port=8080 --target-port=80
kubectl get services
kubectl describe service nginx-deploy
kubectl delete service nginx-deploy
```
`10.104.17.117:8080` is avaliable only inside the cluster.
All requests will be redirected to one of the pods with IP `210.244.x.x:80`
```panel
NAME           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
kubernetes     ClusterIP   10.96.0.1       <none>        443/TCP    3d23h
nginx-deploy   ClusterIP   10.104.17.117   <none>        8080/TCP   14s
```
**Connect to `ClusterIP` service inside the cluster**
```powershell
minikube ssh
docker@minikube:~$ curl 10.104.17.117:8080
```

## Create `NodePort` service
**Create service exposing all nodes outside of cluster and balancing requests among pods**
```powershell
kubectl expose deployment nginx-deploy --type=NodePort --port=8888 --target-port=80
kubectl get services
kubectl describe service nginx-deploy
minikube ip
kubectl delete svc nginx-deploy
```
NodePort service opens port `8888` on every node. 
We can reach every node by its node IP and port `8888`.
External address `192.168.49.2:30691` is avaliable outside of cluster.
All requests will be redirected from `192.168.49.2:30691`
- to NodePort with IP `10.98.216.65:8888` 
- NodePort redirects to one of the pods with IP `210.244.x.x:80`
```panel
NAME           TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
kubernetes     ClusterIP   10.96.0.1      <none>        443/TCP          3d23h
nginx-deploy   NodePort    10.98.216.65   <none>        8888:30691/TCP   9s
```

**Create tunnel to 'nginx-deploy' service in separate terminal**
```panel
Since our cluster runs in Docker we have to create tunnel to `nginx-deploy` service and keep it running in separate terminal.
Otherwise we could just reach service at 192.168.49.2:30691
```
```powershell
minikube service nginx-deploy --url
http://127.0.0.1:53745
```

**Connect to `NodePort` service outside the cluster**
```powershell
curl 127.0.0.1:53745
```

## Create `LoadBalancer` service
**Create tunnel to `minikube` cluster in separate terminal**
```powershell
minikube tunnel
```

**Create service exposing one external IP outside of cluster and balancing requests among pods**
```powershell
kubectl expose deployment nginx-deploy --type=LoadBalancer --port=9999 --target-port=80
kubectl get svc
kubectl describe svc nginx-deploy
kubectl delete svc nginx-deploy
```
External address `127.0.0.1:9999` is avaliable outside of cluster.
All requests will be redirected from `127.0.0.1:9999`
- to LoadBalancer with IP `10.104.113.99:31733` 
- LoadBalancer redirects to one of the pods with IP `210.244.x.x:80`
```panel
NAME           TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
kubernetes     ClusterIP      10.96.0.1       <none>        443/TCP          4d
nginx-deploy   LoadBalancer   10.104.113.99   127.0.0.1     9999:31733/TCP   9s
```

##  Deploy `node.js` application in K8s
**Create `victornovik/k8s-web-hello-ru` Docker image with node.js application**
```powershell
docker build . -t victornovik/k8s-web-hello-ru:latest  -t victornovik/k8s-web-hello-ru:1.0.0
docker images | grep web-hello
```

**Upload Docker image to Docker Hub**
```powershell
docker logout
docker login
docker push victornovik/k8s-web-hello-ru --all-tags
```

**Create `k8s-web-hello` deployment**
```powershell
kubectl create deploy k8s-web-hello --image=victornovik/k8s-web-hello-ru:1.0.0
kubectl get pods -o wide
kubectl describe deploy k8s-web-hello
kubectl describe pod k8s-web-hello-59ffdc5686-6f275

minikube ssh
docker@minikube:~$ curl 10.244.0.11:3000
```

**Create tunnel to `minikube` cluster in separate terminal**
```powershell
minikube tunnel
```

**Create `LoadBalancer` service**
```powershell
kubectl expose deployment k8s-web-hello --type=LoadBalancer --port=3333 --target-port=3000
kubectl get svc
kubectl describe svc k8s-web-hello

kubectl scale deploy k8s-web-hello --replicas=7
```
Type in `http://localhost:3333/` in browser and every time it will return the name of different pod that handled this request

**Uplift the version of Docker image up to 2.0.0**
```powershell
docker build . -t victornovik/k8s-web-hello-ru:latest  -t victornovik/k8s-web-hello-ru:2.0.0
docker push victornovik/k8s-web-hello-ru --all-tags
```

**Update K8s deployment with image 2.0.0**
```powershell
kubectl rollout status deploy k8s-web-hello
kubectl set image deploy k8s-web-hello k8s-web-hello-ru=victornovik/k8s-web-hello-ru:2.0.0
kubectl rollout status deploy k8s-web-hello
```
All containers with image `k8s-web-hello-ru` are updated to image `victornovik/k8s-web-hello-ru:2.0.0`
Type in `http://localhost:3333/` in browser and it will return the response of version 2.0.0



## Useful links
- [K8s Getting started](https://kubernetes.io/docs/setup/)
- [K8s Install tools](https://kubernetes.io/docs/tasks/tools/)
- [Download Node.js](https://nodejs.org/en/download)
- [Docker Hub](https://hub.docker.com/repositories/victornovik)
- [Bogdan Stashchuk K8s repository](https://github.com/bstashchuk/k8s)