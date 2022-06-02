const { Entity, Client, Schema } = require('redis-om');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 5000;

class Todo extends Entity {}

const todoSchema = new Schema(Todo, {
  id: { type: 'string' },
  bodyText: { type: 'string' },
  completed: { type: 'boolean' }
});

app.listen(port, () => console.log(`Listening on port ${port}`));

const client = new Client();

app.put('/api/todos', async (req, res) => {
  await client.open('redis://127.0.0.1:6379');
  const todoRepository = client.fetchRepository(todoSchema);
  const todo = await todoRepository.createAndSave(req.body.data);
  await client.close();
  res.status(201).json(todo)
});

app.delete('/api/todos/:id', async (req, res) => {
  await client.open('redis://127.0.0.1:6379');
  const todoRepository = client.fetchRepository(todoSchema);
  await todoRepository.remove(req.params.id);
  res.status(204).send({ entityId: req.params.id });
});

app.post('/api/todos/:id', async (req, res) => {
  await client.open('redis://127.0.0.1:6379');
  const todoRepository = client.fetchRepository(todoSchema);
  const todo = await todoRepository.fetch(req.params.id);
  todo.id = req.body.data.id ?? null;
  todo.bodyText = req.body.data.bodyText ?? null;
  todo.completed = req.body.data.completed ?? null;
  const updatedTodo = await todoRepository.save(todo);
  res.status(200).send(updatedTodo);
});

app.get('/api/todos', async (req, res) => {
  await client.open('redis://127.0.0.1:6379');
  const todoRepository = client.fetchRepository(todoSchema);
  await todoRepository.createIndex();
  let todos;
  if (req.body.completed) {
    todos = await todoRepository.search().where('completed').is.true().return.all();
  } else if (req.body.active) {
    todos = await todoRepository.search().where('completed').is.false().return.all();
  } else {
    todos = await todoRepository.search().return.all();
  }
  res.status(200).send(todos);
});
