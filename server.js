const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware (промежуточное ПО)
app.use(cors());
app.use(express.json());

// Подключение к базе данных MongoDB
mongoose.connect('mongodb+srv://Alisher:<db_password>@cluster0.ajmm1ju.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Успешное подключение к MongoDB!');
}).catch(err => {
  console.error('Ошибка подключения к MongoDB:', err);
});

// Схема и модель для пользователя
const userSchema = new mongoose.Schema({
  iin: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'parent' },
});

const User = mongoose.model('User', userSchema);

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
    res.status(500).send({ message: 'Ошибка сервера' });
  }
});

// Новый маршрут для входа в систему
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

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
// ...existing code...
module.exports = mongoose.model('User', userSchema);