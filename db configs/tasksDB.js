const Database = require('better-sqlite3');

const tasksDb = new Database('../databases/tasks.db');

try {
    tasksDb.exec(`CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        taskName TEXT,
        taskDescription TEXT,
        username TEXT,
        taskId TEXT,
        isFavorite TEXT,
        marker TEXT
    )`);
    console.log('Подключение к базе данных пользователей успешно установлено.');
} catch (err) {
    console.error('Ошибка открытия базы данных: ' + err.message);
}

module.exports = tasksDb;
