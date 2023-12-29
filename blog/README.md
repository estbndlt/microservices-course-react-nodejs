# Overview

This is a simple microservice app that uses a react app to create posts and comments.

Apps

- client - react front end
- event-bus - simple event handler to receive and transmit events to other microservices
- posts - creates posts
- comments - creates comments
- moderation - moderates a comment
- query - allows getting comments/posts

# Creating docker images of each microservice and client

```bash
# build the docker image with latest tag in service directory
docker build -t estbndlt/query .

# push image to docker hub in service directory
docker push estbndlt/query
```

# Running the app

Skaffold is used to run all docker containers. This will also autoload changes made during development and delete images when the skaffold instance is closed.

```bash
skaffold dev
```
