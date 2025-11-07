const Database = require('better-sqlite3');

const usersDb = new Database('../databases/users.db');

try {
    usersDb.exec(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        token TEXT
    )`);
    console.log('Подключение к базе данных пользователей успешно установлено.');
} catch (err) {
    console.error('Ошибка открытия базы данных: ' + err.message);
}

module.exports = usersDb;
