const mongoose = require('mongoose');
const User = require('./server'); // Подключаем модель пользователя из server.js

// Подключение к базе данных MongoDB
mongoose.connect('mongodb://localhost:27017/usersDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Подключение к MongoDB для скрипта успешно!');

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
