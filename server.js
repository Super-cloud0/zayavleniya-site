const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Добавим path для ясности, хотя он сейчас не используется

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGO_URI;

// Middleware (промежуточное ПО)
// Убедитесь, что 'https://zayavleniya-site.vercel.app' - это ТОЧНЫЙ адрес вашего фронтенда
app.use(cors({ origin: 'https://zayavleniya-site.vercel.app' }));
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
    process.exit(1); // Выход из приложения с ошибкой при неудачном подключении к БД
});

// ------------- ОПРЕДЕЛЕНИЕ СХЕМ И МОДЕЛЕЙ ------------
// Схема и модель для пользователя
const userSchema = new mongoose.Schema({
    iin: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'parent' }, // Роль по умолчанию 'parent'
});
const User = mongoose.model('User', userSchema);

// Схема и модель для заявления
const applicationSchema = new mongoose.Schema({
    iin: { type: String, required: true }, // ИИН пользователя, отправившего заявление
    director_name: { type: String, required: true },
    application_type: { type: String, required: true },
    parent_name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    child_class: { type: String, required: true },
    child_name: { type: String, required: true },
    start_date: { type: String, required: true },
    end_date: { type: String, required: true },
    status: { type: String, default: 'pending' }, // pending, approved, rejected
    timestamp: { type: Date, default: Date.now },
});
const Application = mongoose.model('Application', applicationSchema);
// ---------------------------------------------------


// ------------- МАРШРУТЫ API ------------

// Маршрут для регистрации пользователя
app.post('/register', async (req, res) => {
    try {
        const { iin, password, role } = req.body;
        const user = new User({ iin, password, role });
        await user.save();
        res.status(201).send({ message: 'Пользователь успешно зарегистрирован!' });
    } catch (error) {
        if (error.code === 11000) {
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

// Маршрут для отправки заявления
app.post('/applications', async (req, res) => {
    try {
        const {
            iin, director_name, application_type, parent_name,
            address, phone, child_class, child_name,
            start_date, end_date
        } = req.body;

        const newApplication = new Application({
            iin, director_name, application_type, parent_name,
            address, phone, child_class, child_name,
            start_date, end_date
        });

        await newApplication.save();
        res.status(201).send({ message: 'Заявление успешно отправлено!', application: newApplication });
    } catch (error) {
        console.error("Ошибка при отправке заявления:", error);
        res.status(500).send({ message: 'Ошибка сервера при отправке заявления.' });
    }
});

// Маршрут для получения всех заявлений (для администратора/воспитателя)
app.get('/applications', async (req, res) => {
    try {
        const applications = await Application.find({});
        res.status(200).send(applications);
    } catch (error) {
        console.error("Ошибка при получении заявлений:", error);
        res.status(500).send({ message: 'Ошибка сервера при получении заявлений.' });
    }
});

// Маршрут для изменения роли пользователя (ТОЛЬКО ДЛЯ АДМИНА)
app.put('/users/:iin/role', async (req, res) => {
    try {
        const { iin } = req.params;
        const { role } = req.body;

        // В реальном приложении здесь обязательно нужна аутентификация и проверка прав администратора
        const user = await User.findOneAndUpdate({ iin: iin }, { role: role }, { new: true });

        if (user) {
            res.status(200).send({ message: `Роль пользователя с ИИН ${user.iin} изменена на ${user.role}.` });
        } else {
            res.status(404).send({ message: `Пользователь с ИИН ${iin} не найден.` });
        }
    } catch (error) {
        console.error("Ошибка при изменении роли:", error);
        res.status(500).send({ message: 'Ошибка сервера при изменении роли.' });
    }
});

// ---------------------------------------------------

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
