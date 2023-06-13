# Reddit Community Analyzer

## About
This is a project intended for academic purposes that uses the Reddit API to download information from Reddit and create statistics from it. These stats are easily accesible to a user through a website and all of the information is stored in a database.

The project is made with React.js and uses a MongoDB database with a process queue implemented with bullmq in Redis. The frontend uses Bootstrap for styling (with css also) and modules like [CalHeatmap](https://cal-heatmap.com/) and [Chartist](https://gionkunz.github.io/chartist-js/).

## Self Hosting
As well as being able to access and see the website from the internet, thanks to the project being open source, one could clone this repository and host the database themselves. Self hosting is of course allowed, in case you wanted to download the data yourself and have it in your own local database. To make it easier, I will now explain the necessary steps to self host this app. Bear in mind that some technichal knowledge will be required to accomplish this.

### Recommendations
---
1. Host the app in a **Linux machine**. The steps will show how to set it up in a Linux machine (more specifically, in Ubuntu), as it is usually better for hosting. Of course, it can also be done in other OSs.
2. Have some knowledge about Git, Docker and Docker Compose, as these will be the most important parts of the process.

### Requirements
---
#### 1. Have Docker and Docker Compose installed
For this you can follow the instructions in this link: https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04. Docker and Docker Compose are needed for the deployment of the different services (MongoDB, Redis queue, backend and frontend). 
#### 2. Get Reddit API Credentials
This credentials are necessary to interact with the API. A regular Reddit account is also necessary for this. They can be obtained here: https://www.reddit.com/wiki/api. Only the **CLIENT_SECRET**, **CLIENT_ID** and **REFRESH_TOKEN** are used in this project. This is because there is no need for a user to be logged in.

### 1. Clone the repository
---
The first step is to clone the reopository. You can copy the url that appears by clicking the green "Code" button above or just pasting and executing this command:
```bash
git clone https://github.com/i-penr/community-analyzer.git
```

### 2. Prepare the environment
---
Enter the cloned repository. There are some **environment variables** to be set. One way of doing that is by creating a **.env** file in the **./backend** directory. This **.env** file should include the following variables:
```txt
CLIENT_SECRET="client_secret"
CLIENT_ID="client_id"
REFRESH_TOKEN="refresh_token"
REDIS_HOST="comm-redis"
REDIS_PORT=6379
DEBUG_MODE=false
```
  - **CLIENT_SECRET**, **CLIENT_ID** and **REFRESH_TOKEN** are the credentials for the Reddit API. DO NOT UPLOAD THEM ANYWHERE. The .env file is automatically ignored in the **.gitignore**.
  - **REDIS_HOST**: The name of the Redis host. As mentioned before, Redis is used to manage the task queues. *Only change this value if you have basic Docker knowledge (this value is used in the docker_compose)*
  - **REDIS_PORT**: The port of Redis. It can be anything, however, for Redis instances it is normally 6379. *Only change this value if you have basic Docker knowledge (this value is used in the docker_compose)*
  - **DEBUG_MODE**: This is a boolean variable. If true, it opens some debug endpoints to delete or get elements from different tables. It also opens the endpoint localhost:8080/arena that acts as a GUI for the task queue.

### 3. Deploy the application
---
With all the steps before done, the next command executed in the root of the project should deploy the application:
```bash
docker compose up --build
```
After a while, the backend should be up in port 8080 and the frontend in port 3000. You should be able to see the website interface by going to http://localhost:3000.

## License
This product is free to use, free to contribute and free to do with it whatever you want, only limited by Reddit's API Terms: https://www.redditinc.com/policies/developer-terms and https://www.redditinc.com/policies/data-api-terms.

