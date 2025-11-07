const express = require('express');
const cors = require('cors');
const app = express();

const authRouter = require('../routes/auth');
const tasksRouter = require('../routes/tasks');

app.use(express.json());
app.use(cors());

app.use('/auth', authRouter);
app.use('/tasks', tasksRouter);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
