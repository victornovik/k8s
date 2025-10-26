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

**Install `nginx` container in order to verify Docker**

```powershell
docker run -p 8080:80 -d nginx
```

## Run k8s cluster

**Start `minikube` cluster in Docker**

```powershell
minikube start --driver=docker
minikube status
```

**Access just launched `minikube` cluster by `kubectl`**

```powershell
kubectl cluster-info
kubectl get nodes
kubectl get pods
kubectl get namespaces
```

**See pods of the master node (the same as worker node since we have single-node cluster)**

```powershell
kubectl get pods --namespace=kube-system
```

**See the IP address of the node**

```powershell
minikube ip
```

**Connect to k8s node and see `Docker` containers running within `minikube` Docker container**


```powershell
minikube ssh
docker@minikube:~$ docker ps
docker@minikube:~$ docker version
exit
```
---

<details>
<summary>Docker versions</summary>  
Docker version used inside k8s nodes is different than the Docker version on our computer
</details>

---

## Useful links
- []()
