---
title: "Deploying Django Web Application in Docker With PostgreSQL, NGINX, and Gunicorn"
date: 2022-10-16T14:19:10-04:00
draft: false
---

I recently created a clean art portfolio website for my wife at
[christinanissi.com](https://christinanissi.com) and I wanted to deploy it in Docker. As
I was looking for the best solution for my needs I stumbled upon many guides that ran
the Django web application inside a Docker container behind an NGINX reverse proxy
_which also ran in a container_. However, this solution has many downsides which you can
read more about from
[this article](https://nickjanetakis.com/blog/why-i-prefer-running-nginx-on-my-docker-host-instead-of-in-a-container).

In this post I will show my solution which runs NGINX on the host server while the
actual Django web application is running inside of a container on a Gunicorn WSGI
server. I'm also using poetry to manage my python requirements but you can use the
traditional approach of requirements.txt file (or manually manage python packages in the
Dockerfile).

## Dockerfile and Docker Compose to Run Gunicorn WSGI Server and PostgreSQL

To start off I have created a Dockerfile which builds a Docker Image suitable for the
container based on Alpine Linux.

```dockerfile
# Pull python image
FROM python:3.10-alpine

# Set work directory
WORKDIR /usr/src/app

# Set python env variables
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

# Install pip package dependencies
RUN apk update \
    && apk add postgresql-dev gcc python3-dev musl-dev g++

# Install dependencies with poetry
RUN pip install -U --pre pip poetry
ADD poetry.lock .
ADD pyproject.toml .
RUN poetry config virtualenvs.create false
RUN poetry install --no-interaction --no-root

# Copy and set entrypoint as executable
COPY ./entrypoint.prod.sh .
RUN sed -i 's/\r$//g' /usr/src/app/entrypoint.prod.sh
RUN chmod +x /usr/src/app/entrypoint.prod.sh

# Copy project
COPY . .

# Run entrypoint
ENTRYPOINT ["/usr/src/app/entrypoint.prod.sh"]
```

To summarize the dockerfile, I first begin by using the official Alpine Linux Python
image as a base. I then install some additional packages which are required to build
[Werkzeug](https://werkzeug.palletsprojects.com/en/2.2.x/) Python package among other
things. Next I use poetry to install the Python dependencies. Lastly I copy the project
files inside of the image, set the entrypoint script as executable and define the image
entrypoint as that script. The entrypoint script in my case just checks if PostgreSQL is
running and when it is it begins executing the command defined in the docker compose
file:

```sh
#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $DB_HOST $DB_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

exec "$@"
```

As I mentioned earlier I am running the Django web application with a Gunicorn WSGI
server. This is done by using the following Docker Compose file. I am also running my
PostgreSQL database inside of a container with the default Alpine Linux PostgreSQL
image.

```docker
version: "3.9"

services:
  db:
    image: postgres:14-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data/
    env_file:
      - ./.env.prod.db
  web:
    build:
      context: ./src
      dockerfile: Dockerfile.prod
    command: gunicorn christinanissi.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - .:/code:cached
      - ./src/staticfiles:/usr/src/app/staticfiles
      - ./src/mediafiles:/usr/src/app/mediafiles
    ports:
      - "8005:8000"
    env_file:
      - ./.env.prod
    depends_on:
      - db
volumes:
  postgres_data:
```

The important details here are to note that I am using
[bind mounts](https://docs.docker.com/storage/bind-mounts/) instead of named volumes.
This is important as we need access to this data on the host server for our NGINX
configuration. I am also opening the gunicorn server to a local port 8005 on the host
server which is how we can access it from NGINX.

After building the image and running our containers we can move on to the NGINX
configuration.

## NGINX Configuration as a Reverse Proxy on the Host Machine

Now we should have two containers running on our server — the PostgreSQL container and
our web application container running a Gunicorn WSGI server which is open to a local
port 8005. To setup the NGINX reverse proxy we need to listen to port 80 for http
traffic (https traffic comes from port 443 which I won't go over on this guide). We
define the server name and then to connect the traffic to our gunicorn WSGI server we
use NGINX proxy pass to direct the traffic to our local port 8005. We need to also make
sure that the local WSGI server gets the correct headers from each request so we also
pass those.

In the last section I mentioned how I mounted the static and media file directories as
bind mounts. The reason for that is so we can access the files with NGINX on the host
machine since we don't want to serve the static files with a WSGI server (that is bad
practice and very slow compared to NGINX). To serve the static and media files with
NGINX we define the url location such as `/static/` and the path to the bind mount where
these static files reside on the host server.

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name <host_name>;

    location / {
        proxy_pass http://localhost:8005;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }

    location /static/ {
        alias <path_to_project_dir>/src/staticfiles;
    }

    location /media/ {
        alias <path_to_project_dir>/src/mediafiles;
    }
}
```

## Conclusion

By containerizing only the Django web application and PostgreSQL database while having
NGINX running on the host machine we can make sure that our NGINX server is always
running and we can also have multiple web applications or static websites running on the
same server as they are not limited to a docker container.

To see the full configuration for this web application I used as an example in this
guide you can visit its
[git repository](https://github.com/miikanissi/christinanissi.com).
