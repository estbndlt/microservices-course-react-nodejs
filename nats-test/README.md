# Notes

## How do you communicate with a kubernetes cluster in a dev environment?

- Ingress + ClusterIP - inconvenient to turn on and off easily
- NodePort - less overhead but still inconvenient to turn on and off easily
- port forwarding - done through command line

## Port Forwarding

```
kubectl get pods

kubectl port-forward nats-depl-74f56bc5f6-7qc99 4222:4222
```

- Leave the terminal open
- Now if you go back to nats-test you can run `npm publish`
