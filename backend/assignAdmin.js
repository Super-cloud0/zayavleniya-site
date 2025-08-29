const mongoose = require('mongoose');

// ВАЖНО: Вставьте вашу полную строку подключения здесь
const MONGODB_URI = "mongodb+srv://Alisher:Alisher228@cluster0.ajmm1ju.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Определение схемы и модели User
const userSchema = new mongoose.Schema({
    iin: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'parent' },
});
const User = mongoose.model('User', userSchema);

// Подключение к базе данных MongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('✅ Подключение к MongoDB для скрипта успешно!');

    const iinToUpdate = '100610553952'; // ИИН пользователя, которому вы хотите дать роль администратора
    
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
        // Обязательно закрываем соединение после выполнения скрипта
        mongoose.connection.close(); 
    }
})
.catch(err => {
    console.error('❌ Ошибка подключения к MongoDB:', err);
    process.exit(1);
});