# NodePort Service

Node ports are typically used to communicate with a single service and is mainly done in dev environments only.

## Create the deployment

```
kubectl apply -f posts-srv.yaml
```

Verify pod is running

```
estebandelatorre@Estebans-MacBook-Air k8s % kubectl get pods

NAME                          READY   STATUS    RESTARTS   AGE
posts-depl-5484847b6f-pqtxj   1/1     Running   0          9s
```

## Create the service

- See posts-srv.yaml

```
estebandelatorre@Estebans-MacBook-Air k8s % kubectl apply -f posts-srv.yaml
service/posts-srv created
```

## Get the services running

```
estebandelatorre@Estebans-MacBook-Air k8s % kubectl get services
NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
kubernetes   ClusterIP   10.96.0.1      <none>        443/TCP          4m26s
posts-srv    NodePort    10.98.117.59   <none>        4000:30221/TCP   2m38s
```

## See service details

```
estebandelatorre@Estebans-MacBook-Air k8s % kubectl describe service posts-srv
Name:                     posts-srv
Namespace:                default
Labels:                   <none>
Annotations:              <none>
Selector:                 app=posts
Type:                     NodePort
IP Family Policy:         SingleStack
IP Families:              IPv4
IP:                       10.98.117.59
IPs:                      10.98.117.59
LoadBalancer Ingress:     localhost
Port:                     posts  4000/TCP
TargetPort:               4000/TCP
NodePort:                 posts  30221/TCP
Endpoints:                10.1.0.31:4000
Session Affinity:         None
External Traffic Policy:  Cluster
Events:                   <none>
```

- Note: `localhost:30221/posts` will be the port open to communicate the service.
