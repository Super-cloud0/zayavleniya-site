const mongoose = require('mongoose');
const User = require('./server'); // Используйте правильный путь, если модель в другом файле

// Проверяем, что переменная окружения MONGO_URI существует
if (!process.env.MONGO_URI) {
    console.error("Ошибка: Переменная окружения MONGO_URI не установлена.");
    process.exit(1);
}

// Подключение к базе данных MongoDB, используя переменную окружения
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('Подключение к MongoDB для скрипта успешно!');

    const iinToUpdate = '100610553952'; // Вставьте ИИН пользователя
    
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
