# ToDo App

This a ToDo app using React (with Typescript), Express and [Redis OM](https://github.com/redis/redis-om-node).

## Running

Launch `yarn install` to install all the dependencies.

Launch Redis Stack with `docker-compose -f redis-stack.yml up`.

Use `redis-cli` to connect to `localhost:6379` and browse Redis. You can run the following to install Redis CLI on Ubuntu: `sudo apt-get install redis-tools`.

Launch the Express back-end with `yarn run express` (port: 5000). To test:
- Create a todo: `curl -XPUT localhost:5000/api/todos --data '{"title": "some todo", "completed": false}' -H 'Content-Type: application/json'`
- Delete a todo: `curl -XDELETE localhost:5000/api/todos/TODO_ID`
- Update a todo: `curl -XPOST localhost:5000/api/todos/TODO_ID --data '{"title": "some updated todo", "completed": true}' -H 'Content-Type: application/json'`
- Get all todos: `curl -XGET localhost:5000/api/todos --data '{"all": true}' -H 'Content-Type: application/json'`
- Get active todos: `curl -XGET localhost:5000/api/todos --data '{"active": true}' -H 'Content-Type: application/json'`
- Get completed todos: `curl -XGET localhost:5000/api/todos --data '{"completed": true}' -H 'Content-Type: application/json'`

Launch the application with `yarn run start` to run the application and browse to it at [http://localhost:3000/](http://localhost:3000/).
