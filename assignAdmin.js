const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Загружаем .env
dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('Подключение к MongoDB успешно!');

  const iinToUpdate = '100610553952';

  try {
    const user = await User.findOneAndUpdate(
      { iin: iinToUpdate },
      { role: 'admin' },
      { new: true }
    );

    if (user) {
      console.log(`✅ Успешно! Роль пользователя с ИИН ${user.iin} изменена на ${user.role}`);
    } else {
      console.log(`❌ Пользователь с ИИН ${iinToUpdate} не найден.`);
    }
  } catch (error) {
    console.error('Ошибка при обновлении роли:', error);
  } finally {
    mongoose.connection.close();
  }
})
.catch(err => {
  console.error('Ошибка подключения к MongoDB:', err);
});
