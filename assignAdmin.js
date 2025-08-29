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

  const iinToUpdate = '100610553952'; // <-- Вставьте ИИН пользователя, которому хотите дать роль администратора
  
  try {
    const user = await User.findOneAndUpdate(
      { iin: iinToUpdate },
      { role: 'admin' },
      { new: true }
    );
    
    if (user) {
      console.log(`Успешно! Роль пользователя с ИИН ${user.iin} изменена на ${user.role}`);
    } else {
      console.log(`Пользователь с ИИН ${iinToUpdate} не найден.`);
    }
  } catch (error) {
    console.error('Ошибка при обновлении роли:', error);
  } finally {
    mongoose.connection.close();
  }
}).catch(err => {
  console.error('Ошибка подключения к MongoDB:', err);
});
