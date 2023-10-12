---
title: "Setting up a Local Odoo 16 Development Server With Docker"
description:
  "Guide on setting up a local Odoo 16 development server on Debian or Ubuntu with
  Docker to create and develop custom Odoo modules"
date: 2023-07-15T23:48:21-04:00
toc: True
---

Odoo is a framework and a suite of open source business applications including CRM,
e-commerce, accounting, manufacturing, warehouse, and inventory management to name a
few. It is fully customizable to every business need because its extensible architecture
allows developers to modify existing applications and create new applications. I have
ample experience solving business needs from small clients to larger enterprises using
the Odoo framework. In this guide, I will share my personal development environment and
help you create your own local development server for Odoo 16 utilizing Docker.

## Installing Docker

To begin, we must first have Docker Engine and Docker Compose installed on our system.
The installation will vary depending on what platform you're on and detailed
instructions for your platform can be found from the
[official Docker documentation](https://docs.docker.com/engine/install/). Here, I will
share the installation process for Debian 11 and 12 or Ubuntu 20.04, 22.04, 22.10, and
23.04:

### Uninstall Old Docker Versions

To make sure your system has no conflicting versions installed, it is a good idea to
first run this command to uninstall them:

```bash
for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do sudo apt-get remove $pkg; done
```

### Set Up Docker Repository

In order to get the latest Docker packages, we are using the official Docker repository.

Let's first update the apt package index and install the prerequisite packages:

```bash
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
```

Next, we add the official Docker GPG key to ensure authenticity and security of our
Docker packages:

#### Debian 11 and 12

```bash
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

#### Ubuntu 20.04, 22.04, 22.10, and 23.04

```bash
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

### Install Docker Engine and Docker Compose

Now that the repository is all set up. We just need to update our package index and
install the necessary Docker packages:

```bash
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

## Creating Odoo Configuration and Directory Structure

Now that we have Docker installed, we can start setting up our Odoo configuration. You
are free to choose whatever directory works for you, but for the purpose of this
tutorial, we will be placing our Odoo 16 files in `/opt/odoo/16/` directory.

First, let's create the directory and navigate inside of it:

```bash
mkdir -p /opt/odoo/16
cd /opt/odoo/16
```

Next, create another directory here that will house all the configuration files:

```bash
mkdir -p /opt/odoo/16/conf
```

### Creating a Dockerfile

In the `conf` directory, we will create a Dockerfile which will contain instructions for
Docker to build an image. A Docker image is essentially a template containing
instructions for Docker to build a container out of.

```bash
nano /opt/odoo/16/conf/Dockerfile
```

In this file, you can install any additional external dependencies required by your
custom Odoo modules. The following is a great basic template to use for your first
Dockerfile:

```dockerfile
FROM odoo:16
user root
RUN apt-get -y update && apt-get install -y git && apt-get install -y xmlsec1
RUN pip3 install --upgrade --no-cache-dir pip
RUN pip3 install --no-cache-dir astor
RUN pip3 install --no-cache-dir cachetools
RUN pip3 install --no-cache-dir openupgradelib
RUN pip3 install --no-cache-dir wheel
# Password security
RUN pip3 install --no-cache-dir zxcvbn
```

Here you can see the first line of this Dockerfile actually pulls the official Odoo 16
Docker image, which we are using to build a custom image on top of.

### Setting up Odoo configuration

Next we will be creating a new directory inside the `/opt/odoo/16/conf/` directory. The
new directory will be the name of your Odoo development database. This will make sense
when we have multiple Odoo instances running on our computers for different databases.

```bash
mkdir -p /opt/odoo/16/conf/odoo1
```

Here, we will first add our Odoo configuration file to a `config` directory. To learn
more about Odoo configuration files, you may read
[the official Odoo documentation](https://www.odoo.com/documentation/16.0/administration/install/deploy.html#).

```bash
mkdir -p /opt/odoo/16/conf/odoo1/config/
nano /opt/odoo/16/conf/odoo1/config/odoo.conf
```

Here is a simple example of an Odoo configuration file you can use:

```
[options]

# ADMIN PASSWORD
admin_passwd = SecretPassword123

# DATABASE
db_host = db
db_port = 5432
db_user = odoo
db_name = False
db_password = SecretDBPassword123
db_maxconn = 50
list_db = True

# PROXY
proxy_mode = False

# LOGGING
logfile =
logrotate = False
syslog = False
log_handler = :INFO
log_level = debug

# MISC:
without_demo = all

workers = 4
limit_memory_hard = 3360319078
limit_memory_soft = 2688255262
limit_request = 8192
limit_time_cpu = 300
limit_time_real = 600
max_cron_threads = 2
server_wide_modules = base,web
gevent_port = 8072
http_port = 8069

# DIRECTORIES
data_dir = /var/lib/odoo/
addons_path = /usr/lib/python3/dist-packages/odoo/addons,/opt/odoo/16/addons/
```

In the configuration file, the setting you might change is the `addons_path` option. The
addons path is a comma separated list of directory paths which contain Odoo modules. In
this basic example we are only using two directory paths - base Odoo addons path and the
root directory of `opt/odoo/16/addons` (which we will get back to later in this guide).

### Docker Compose Configuration

Now that we have created our Dockerfile with instructions for building a Docker image
containing all of our system tools and packages, and we have a simple Odoo configuration
file set up, we can move on to creating a Docker compose file which will take the Docker
image and build a container where our Odoo instance will be running on.

```bash
nano /opt/odoo/16/conf/odoo1/docker-compose.yml
```

The following is an example of a basic docker compose file you may use to get started. I
won't be going on in depth what all the different options mean. But the most important
parts to take note of are as follows:

- Container name: This will be the name of the container to help you identify what the
  purpose of the container is. Here we are using the name of our Odoo database, odoo1 as
  the identifier.
- Ports: This option defines what local system ports will be used to access certain
  ports on the container. Odoo runs on the port 8069 by default, so we will be using
  that. If you have multiple Odoo containers running on your system, you need to assign
  different ports for each container so that they won't overlap. For example, you could
  set up your local port 8079 to connect to the container's port 8069 by typing
  "8079:8069" instead.
- Volumes: Volumes will map certain directories from your system to be accessible in the
  container. This is necessary so that the container can find your Odoo addons and
  configuration files. We are also mapping the file store and database of the container
  to a named volume so that the data will be persistent even if the container is taken
  down.

```docker
version: "3.1"
services:
  web:
    image: custom-odoo:16
    container_name: odoo1
    depends_on:
      - db
    restart: always
    ports:
      - "8069:8069"
      - "8072:8072"
    volumes:
      - odoo1-web-data:/var/lib/odoo
      - ./config:/etc/odoo
      - /opt/odoo/16/addons:/opt/odoo/16/addons
      - /var/log/odoo:/var/log/odoo
    environment:
      - PASSWORD = SecretDBPassword123
  db:
    image: postgres:13
    container_name: odoo1_postgres
    environment:
      - POSTGRES_DB=postgres
      - POSTGRES_PASSWORD=SecretPassword123
      - POSTGRES_USER=odoo
      - PGDATA=/var/lib/postgresql/data/pgdata
    volumes:
      - odoo1-db-data:/var/lib/postgresql/data/pgdata
volumes:
  odoo1-web-data:
  odoo1-db-data:
```

### Custom Odoo Modules Directory

Lastly, the guide would not be complete without creating a location for your custom Odoo
modules that you're trying to develop. For simplicity, we will just create a single
directory which will contain all of your custom Odoo modules.

```bash
mkdir -p /opt/odoo/16/addons/
```

You may now add any of your custom modules in this directory. Once we boot up our Odoo
container, they will be available to you inside the Odoo applications list.

### Recap of the configuration

To recap, we created a Dockerfile which has instructions for building the Docker image
for Odoo. Then we set up our Odoo configuration for a database called odoo1. We also
created a Docker Compose file which will build the Odoo container. Lastly, we created a
directory to house all of your custom Odoo modules.

If you have followed the guide correctly, you should have a directory tree that looks as
follows:

```bash
/opt/odoo
└── 16
    ├── addons
    └── conf
        ├── Dockerfile
        └── odoo1
            ├── config
            │   └── odoo.conf
            └── docker-compose.yml
```

## Running the Configuration

We are all done with the configuration. Now we just need to create the Docker image and
then run our first Odoo container.

### Building the Docker Image for Odoo

After running this command, we would only need to run it again in order to build a new
image in case there is an upstream Odoo update or if we modify our Dockerfile with
additional instructions.

```bash
cd /opt/odoo/16/conf/
sudo docker build custom-odoo:16.0 .
```

### Creating the Docker container for an Odoo instance

The following command will create a new Odoo container from our Docker compose file if
it doesn't yet exist. The same command will also be used whenever we reboot our local
Odoo server.

```bash
sudo docker compose -f /opt/odoo/16/conf/odoo1/docker-compose.yml up -d --force-recreate
```

If you followed the guide closely, you should now be able to navigate to
[http://localhost:8069](http://localhost:8069) to log in to your Odoo database. The
credentials will be admin as the username and the password will be the password defined
in the `odoo.conf` file - in our case _SecretPassword123_.

To view Odoo logs from the container we can run this command:

```bash
sudo docker logs -f --tail=500 odoo1
```

## Bonus Tips

Due to the way we have set up our directory structure, we can now easily duplicate this
setup for any other Odoo version or have multiple Odoo instances running on our machine.

To set up an Odoo instance for another Odoo version, all you have to do is copy the
entire `/opt/odoo/16/` directory into `/opt/odoo/<version_number>` and then go through
the files and change each instance of 16 into the version number you want to use.

In the same vein, to create an additional Odoo instance you just copy the
`/opt/odoo/16/conf/odoo1/` directory into `/opt/odoo/16/conf/<database_name>` and change
the instances of odoo1 with your new database name.

For both of these, you need to also change the default ports in the `docker-compose.yml`
file to avoid overlap. See the earlier mention of the ports above.

## Conclusion

Hopefully this guide has helped you create a local Odoo development server or given you
an overview of running Odoo in a Docker container. Feel free to reach out to me via
email at [miika@miikanissi.com](mailto:miika@miikanissi.com) for any comments, feedback,
or assistance.
