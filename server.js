const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = "mongodb+srv://Alisher:Alisher228@cluster0.ajmm1ju.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.use(cors({ origin: 'https://zayavleniya-site.vercel.app' }));
app.use(express.json());

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Успешное подключение к MongoDB!");
})
.catch((err) => {
    console.error("Ошибка подключения к MongoDB:", err);
    process.exit(1);
});

// --- Схемы ---
const userSchema = new mongoose.Schema({
    iin: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'parent' },
});
const User = mongoose.model('User', userSchema);

const applicationSchema = new mongoose.Schema({
    iin: { type: String, required: true },
    director_name: { type: String, required: true },
    application_type: { type: String, required: true },
    parent_name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    child_class: { type: String, required: true },
    child_name: { type: String, required: true },
    start_date: { type: String, required: true },
    end_date: { type: String, required: true },
    status: { type: String, default: 'pending' },
    submission_date: { type: String, default: () => new Date().toLocaleDateString('ru-RU') },
    timestamp: { type: Date, default: Date.now },
});
const Application = mongoose.model('Application', applicationSchema);

// --- Маршруты ---

// Регистрация
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
        res.status(500).send({ message: 'Ошибка сервера' });
    }
});

// Вход
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
        res.status(500).send({ message: 'Ошибка сервера' });
    }
});

// Отправка заявления
app.post('/applications', async (req, res) => {
    try {
        const {
            iin, director_name, application_type, parent_name,
            address, phone, child_class, child_name,
            start_date, end_date
        } = req.body;
        if (!iin || !director_name || !application_type || !parent_name ||
            !address || !phone || !child_class || !child_name ||
            !start_date || !end_date) {
            return res.status(400).send({ message: 'Все поля должны быть заполнены!' });
        }

        const newApplication = new Application({
            iin, director_name, application_type, parent_name,
            address, phone, child_class, child_name,
            start_date, end_date
        });

        await newApplication.save();
        res.status(201).send({ message: 'Заявление успешно отправлено!', application: newApplication });
    } catch (error) {
        res.status(500).send({ message: 'Ошибка сервера при отправке заявления.' });
    }
});

// Получение всех заявлений
app.get('/applications', async (req, res) => {
    try {
        const applications = await Application.find({});
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера при получении заявлений.' });
    }
});

// Одобрить заявление
app.patch('/applications/:id/approve', async (req, res) => {
    try {
        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { status: 'approved' },
            { new: true }
        );
        if (!application) return res.status(404).json({ message: 'Заявление не найдено.' });
        res.json(application);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера при одобрении.' });
    }
});

// Отклонить заявление
app.patch('/applications/:id/reject', async (req, res) => {
    try {
        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { status: 'rejected' },
            { new: true }
        );
        if (!application) return res.status(404).json({ message: 'Заявление не найдено.' });
        res.json(application);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера при отклонении.' });
    }
});

// Удалить заявление
app.delete('/applications/:id', async (req, res) => {
    try {
        await Application.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Заявление удалено.' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера при удалении.' });
    }
});

// Получить заявление по id (оставь только ОДИН маршрут)
app.get('/applications/:id', async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) return res.status(404).json({ message: "Заявление не найдено." });
        res.json(application);
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера при получении заявления." });
    }
});

// Получение пользователей
app.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера при получении пользователей.' });
    }
});

// Изменение роли пользователя
app.put('/users/:iin/role', async (req, res) => {
    try {
        const { iin } = req.params;
        const { role } = req.body;
        const user = await User.findOneAndUpdate({ iin }, { role }, { new: true });
        if (!user) return res.status(404).json({ message: 'Пользователь не найден.' });
        res.status(200).json({ message: 'Роль обновлена.', user });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера при обновлении роли.' });
    }
});

// Удалить пользователя
app.delete('/users/:iin', async (req, res) => {
    try {
        const { iin } = req.params;
        const user = await User.findOneAndDelete({ iin });
        if (!user) return res.status(404).json({ message: 'Пользователь не найден.' });
        res.status(200).json({ message: 'Пользователь удален.' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера при удалении пользователя.' });
    }
});

// Получить заявления пользователя
app.get('/my-applications/:iin', async (req, res) => {
    try {
        const { iin } = req.params;
        const applications = await Application.find({ iin });
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера при получении заявлений.' });
    }
});

// --- Запуск сервера ---
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
