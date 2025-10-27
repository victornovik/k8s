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

## Run K8s cluster

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

## Run K8s deployment and scale it

**Create deployment `nginx-deploy` consisting of one pod**
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

## Useful links
- [Getting started](https://kubernetes.io/docs/setup/)
- [Install tools](https://kubernetes.io/docs/tasks/tools/)