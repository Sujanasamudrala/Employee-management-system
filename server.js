// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3002;

app.use(express.static('public'));
app.use(express.json());

const filePath = './employees.json';

app.get('/api/employees', (req, res) => {
  const data = fs.readFileSync(filePath);
  res.json(JSON.parse(data));
});

app.post('/api/employees', (req, res) => {
  const { name, email, role } = req.body;
  const data = JSON.parse(fs.readFileSync(filePath));
  data.push({ name, email, role });
  fs.writeFileSync(filePath, JSON.stringify(data));
  res.status(201).send('Employee added');
});

app.delete('/api/employees/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const data = JSON.parse(fs.readFileSync(filePath));
  data.splice(index, 1);
  fs.writeFileSync(filePath, JSON.stringify(data));
  res.send('Employee deleted');
});

app.put('/api/employees/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const { name, email, role } = req.body;

  const data = JSON.parse(fs.readFileSync(filePath));
  data[index] = { name, email, role };
  fs.writeFileSync(filePath, JSON.stringify(data));
  res.send('Employee updated');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
