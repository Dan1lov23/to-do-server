const express = require('express');
const router = express.Router();

const db = require('../db configs/tasksDB');

router.post('/createTask', async (req, res) => {
    const {taskName, description, username} = req.body;

    try {
        const stmt = db.prepare('INSERT INTO tasks (taskName, taskDescription, taskId, username, marker, isFavorite) VALUES (?, ?, ?, ?, ?, ?)');
        stmt.run(taskName, description, String(Date.now()), username, 'false', 'false');
        res.json({marker: true, message: "Задача добавлена"});
    } catch (error) {
        console.log(error);
    }

})

router.post('/getTasks', async (req, res) => {
    const { username } = req.body;

    try {
        const tasks = db.prepare('SELECT * FROM tasks WHERE username = ?').all(username);
        res.json({ marker: true, tasks: tasks });
    } catch (error) {
        res.status(500).json({ marker: false, message: 'Ошибка при получении задач', error: error.message });
    }
});

router.delete('/deleteTask', async (req, res) => {
    const {username, taskId} = req.body;
    try {
        const deleteTask = db.prepare('DELETE FROM tasks WHERE username = ? AND taskId = ?');
        deleteTask.run(username, taskId);
        res.json({marker: true })
    } catch (error) {
        res.json({marker: false })
        console.log(error);
    }
})

router.post('/updateTaskMarker', async (req, res) => {
    const {taskMarker, username, taskId} = req.body;
    try {
        const deleteTask = db.prepare('UPDATE tasks SET marker = ? WHERE username = ? AND taskId = ?');
        deleteTask.run(taskMarker, username, taskId);
        res.json({marker: true })
    } catch (error) {
        res.json({marker: false })
        console.log(error);
    }
})

router.post('/changeTask', async (req, res) => {
    const {taskName, taskDescription, taskId, username} = req.body;
    try {
        const updateTask = db.prepare('UPDATE tasks SET taskName = ?, taskDescription = ? WHERE username = ? AND taskId = ?');
        updateTask.run(taskName, taskDescription, username, taskId);
        res.json({marker: true })
    } catch (error) {
        res.json({marker: false })
        console.log(error);
    }
})

router.post('/changeFavorite', async (req, res) => {
    const {username, taskId} = req.body;

    try {
        const task = db.prepare('SELECT * FROM tasks WHERE username = ? AND taskId = ?').all(username, taskId);
        if (task[0].isFavorite === "true") {
            const updateTask = db.prepare('UPDATE tasks SET isFavorite = ? WHERE username = ? AND taskId = ?');
            updateTask.run("false", username, taskId);
        } else if (task[0].isFavorite === "false") {
            const updateTask = db.prepare('UPDATE tasks SET isFavorite = ? WHERE username = ? AND taskId = ?');
            updateTask.run("true", username, taskId);
        }
    } catch (error) {

    }
})

module.exports = router;
