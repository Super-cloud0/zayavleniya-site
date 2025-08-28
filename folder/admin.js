document.addEventListener('DOMContentLoaded', () => {
    const usersList = document.getElementById('users-list');
    const noUsersMessage = document.getElementById('no-users-message');

    // Функция для отображения таблицы пользователей
    function renderUsers() {
        // Получаем список пользователей из локального хранилища
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Если пользователей нет, выводим сообщение
        if (users.length === 0) {
            noUsersMessage.style.display = 'block';
            usersList.innerHTML = '';
            return;
        }

        usersList.innerHTML = '';
        noUsersMessage.style.display = 'none';

        // Создаем HTML-таблицу
        const table = document.createElement('table');
        table.classList.add('users-table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>ИИН</th>
                    <th>Роль</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        const tbody = table.querySelector('tbody');

        // Заполняем таблицу данными о пользователях
        users.forEach((user, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.iin}</td>
                <td>
                    <select class="role-select" data-index="${index}">
                        <option value="parent" ${user.role === 'parent' ? 'selected' : ''}>parent</option>
                        <option value="educator" ${user.role === 'educator' ? 'selected' : ''}>educator</option>
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>admin</option>
                    </select>
                </td>
                <td>
                    <button class="save-role-btn" data-index="${index}">Сохранить</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        usersList.appendChild(table);
    }

    // Обработчик события для кнопки "Сохранить"
    usersList.addEventListener('click', (e) => {
        if (e.target.classList.contains('save-role-btn')) {
            const index = e.target.dataset.index;
            const selectElement = usersList.querySelector(`.role-select[data-index="${index}"]`);
            const newRole = selectElement.value;
            
            let users = JSON.parse(localStorage.getItem('users'));
            if (users[index].role !== newRole) {
                users[index].role = newRole;
                localStorage.setItem('users', JSON.stringify(users));
                alert('Роль успешно обновлена!');
            }
        }
    });

    // Инициализируем отображение пользователей при загрузке страницы
    renderUsers();
});
