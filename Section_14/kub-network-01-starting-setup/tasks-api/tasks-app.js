const path = require('path');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const filePath = path.join(__dirname, process.env.TASKS_FOLDER, 'tasks.txt');

const app = express();

app.use(bodyParser.json());

// 로컬 frontend 어플리케이션에서 브라우저가 task-api에 접근할 수 있도록 헤더 수정
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
})

const extractAndVerifyToken = async (headers) => {
  if (!headers.authorization) {
    throw new Error('No token provided.');
  }
  const token = headers.authorization.split(' ')[1]; // expects Bearer TOKEN

  // 쿠버네티스 상에서 타 Pod와 통신하기 위해 변경
  // const response = await axios.get('http://auth/verify-token/' + token);
  // (1) docker-compose 환경변수 이용
  const response = await axios.get(`http://${process.env.AUTH_ADDRESS}/verify-token/` + token);
  // (2) K8S ClusterIP 활용, (3) K8S CoreDNS(서비스명.네임스페이스명) 활용

  return response.data.uid;
};

app.get('/tasks', async (req, res) => {
  try {
    const uid = await extractAndVerifyToken(req.headers); // we don't really need the uid
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: 'Loading the tasks failed.' });
      }
      const strData = data.toString();
      const entries = strData.split('TASK_SPLIT');
      entries.pop(); // remove last, empty entry
      console.log(entries);
      const tasks = entries.map((json) => JSON.parse(json));
      res.status(200).json({ message: 'Tasks loaded.', tasks: tasks });
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: err.message || 'Failed to load tasks.' });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const uid = await extractAndVerifyToken(req.headers); // we don't really need the uid
    const text = req.body.text;
    const title = req.body.title;
    const task = { title, text };
    const jsonTask = JSON.stringify(task);
    fs.appendFile(filePath, jsonTask + 'TASK_SPLIT', (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: 'Storing the task failed.' });
      }
      res.status(201).json({ message: 'Task stored.', createdTask: task });
    });
  } catch (err) {
    return res.status(401).json({ message: 'Could not verify token.' });
  }
});

app.listen(8000);
