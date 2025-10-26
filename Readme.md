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

**See the IP address of `minikube` node**

```powershell
minikube ip
```

**Connect to k8s node by SSH and see `Docker` containers running within `minikube` Docker container**

```powershell
minikube ssh
docker@minikube:~$ docker ps
docker@minikube:~$ docker version
exit
```
---

<details>
<summary>Different Docker versions inside and outside</summary>  
Docker version used inside k8s nodes is different than the Docker version on our computer
</details>

---

**Create 1 pod with 1 container**

*K8s cluster -> node -> pod -> container*

```powershell
kubectl run nginx-pod --image=nginx
kubectl get pods -o wide
kubectl describe pod nginx-pod
```

- Pay attention this pod actually contains 2 containers.
	- One container `k8s_nginx-pod_nginx-pod_default_xxx` runs `nginx`.
	- Another one `k8s_POD_nginx-pod_default_xxx` contains pod resources reserved for the first container.

```powershell
minikube ssh
# We can reach internal 10.244.0.3 only inside 'minikube' node. We cannot ping it from outside.
docker@minikube:~$ ping 10.244.0.3
docker@minikube:~$ curl 10.244.0.3
docker@minikube:~$ docker ps | grep nginx
```

**Connect to internal `nginx` container created within `minicube` node and execute UNIX commands inside it**

```powershell
docker exec -it bb49069b770c sh
hostname
hostname -I
exit
exit
```

**Delete pod**

```powershell
kubectl delete pod nginx-pod
kubectl get pods -o wide
```

## Useful links
- [Getting started](https://kubernetes.io/docs/setup/)
- [Install tools](https://kubernetes.io/docs/tasks/tools/)