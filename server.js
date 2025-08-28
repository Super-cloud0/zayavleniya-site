const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express(); // Инициализация Express приложения

// Объявление PORT должно быть глобальным или в начале файла, как вы и сделали
const PORT = process.env.PORT || 3000;

const MONGODB_URI = process.env.MONGO_URI; // Используем переменную окружения

// Middleware (промежуточное ПО)
app.use(cors({ origin: 'https://zayavleniya-site.vercel.app' })); // Разрешаем CORS только для вашего домена Vercel
app.use(express.json()); // Для парсинга JSON-запросов

// Подключение к базе данных MongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Успешное подключение к MongoDB!");
})
.catch((err) => {
    console.error("Ошибка подключения к MongoDB:", err);
    // Важно: в реальном приложении здесь можно предпринять действия,
    // например, выйти из процесса, если подключение к БД критически важно.
    process.exit(1); // Выход из приложения с ошибкой
});

// Схема и модель для пользователя
const userSchema = new mongoose.Schema({
    iin: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'parent' }, // Роль по умолчанию 'parent'
});

const User = mongoose.model('User', userSchema);

// Маршрут для регистрации пользователя
app.post('/register', async (req, res) => {
    try {
        const { iin, password, role } = req.body;
        // Здесь можно добавить хеширование пароля перед сохранением для безопасности
        const user = new User({ iin, password, role });
        await user.save();
        res.status(201).send({ message: 'Пользователь успешно зарегистрирован!' });
    } catch (error) {
        if (error.code === 11000) {
            // Ошибка дубликата ключа (пользователь с таким ИИН уже существует)
            return res.status(409).send({ message: 'Пользователь с таким ИИН уже существует!' });
        }
        console.error("Ошибка при регистрации:", error);
        res.status(500).send({ message: 'Ошибка сервера' });
    }
});

// Маршрут для входа в систему
app.post('/login', async (req, res) => {
    try {
        const { iin, password } = req.body;
        const user = await User.findOne({ iin });

        if (!user || user.password !== password) {
            // В реальном приложении здесь нужно сравнивать хешированный пароль
            return res.status(401).send({ message: 'Неправильный ИИН или пароль!' });
        }

        res.status(200).send({
            message: 'Вход выполнен успешно!',
            role: user.role,
            iin: user.iin
        });
    } catch (error) {
        console.error("Ошибка при входе:", error);
        res.status(500).send({ message: 'Ошибка сервера' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});

// Уберите эту строку, она не нужна в этом файле
// module.exports = mongoose.model('User', userSchema);
