const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db configs/usersDB');

router.post('/register', async (req, res) => {

    const { username, password } = req.body;
    console.log(`Начался процесс регистрации пользователя`);

    if (!username || !password) {
        return res.status(400).json({ error: `Имя пользователя и пароль обязательны` });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 5);

        const stmt = db.prepare('INSERT INTO users (username, password, token) VALUES (?, ?, ?)');
        stmt.run(username, hashedPassword, "");

        console.log(`Пользователь зарегистрирован, процесс регистрации завершён`);
        return res.json({ marker: true, message: `Пользователь успешно зарегистрирован` });
    } catch (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
            console.log(`Пользователь с таким именем уже существует, процесс регистрации завершён`);
            return res.json({ marker: false, error: `Пользователь с таким именем уже существует` });
        }
        console.log(`Ошибка при добавлении пользователя: ${err.message}`);
        return res.json({ marker: false, error: "Ошибка сервера"});
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(`Процесс авторизации начат для пользователя: ${username}`);

    try {
        const user = db.prepare("SELECT username, password FROM users WHERE username = ?").get(username);

        if (user) {
            const decryptedPassword = await bcrypt.compare(password, user.password);
            if (decryptedPassword) {
                console.log(`Пользователь успешно вошёл в аккаунт`);
                const token = jwt.sign({ id: user.id }, 'SECRET_KEY', { expiresIn: '1h' });

                const setToken = db.prepare("UPDATE users SET token = ? WHERE username = ?");
                setToken.run(token, username);

                return res.json({ marker: true, token: token, username: username });
            } else {
                return res.json({ marker: false, body: 'Пароль неверный' });
            }
        } else {
            return res.json({ marker: false, body: 'Неправильный логин или пароль' });
        }
    } catch (error) {
        console.log(error);
        return res.json({ error: 'Ошибка сервера' });
    }
});

router.post('/loginCheck', async (req, res) => {
    const { token } = req.body;
    console.log(token);
    const user = db.prepare("SELECT username, password FROM users WHERE token = ?").get(token);

    if (user) {
        res.json({marker: true});
    } else {
        res.json({marker: false});
    }

})

module.exports = router;
