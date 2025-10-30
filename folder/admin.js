document.addEventListener('DOMContentLoaded', () => {
    // Проверка роли пользователя
    const userRole = localStorage.getItem('userRole');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn || userRole !== 'admin') {
        window.location.href = 'index.html';
        return;
    }

    // --- Основной код админки ---
    const usersList = document.getElementById('users-list');
    const noUsersMessage = document.getElementById('no-users-message');

    // Получить пользователей с сервера
    async function fetchUsers() {
        const response = await fetch('https://zayavleniya-site-1.onrender.com/users');
        return await response.json();
    }

    // Обновить роль пользователя на сервере
    async function updateUserRole(iin, role) {
        const response = await fetch(`https://zayavleniya-site-1.onrender.com/users/${iin}/role`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ role })
        });
        return await response.json();
    }

    // Отобразить пользователей
    async function renderUsers() {
        const users = await fetchUsers();
        if (!users.length) {
            noUsersMessage.style.display = 'block';
            usersList.innerHTML = '';
            return;
        }

        usersList.innerHTML = '';
        noUsersMessage.style.display = 'none';

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

        users.forEach((user) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.iin}</td>
                <td>
                    <select class="role-select" data-iin="${user.iin}">
                        <option value="parent" ${user.role === 'parent' ? 'selected' : ''}>parent</option>
                        <option value="educator" ${user.role === 'educator' ? 'selected' : ''}>educator</option>
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>admin</option>
                    </select>
                </td>
                <td>
                    <button class="save-role-btn" data-iin="${user.iin}">Сохранить</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        usersList.appendChild(table);
    }

    // Изменить роль пользователя
    usersList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('save-role-btn')) {
            const iin = e.target.dataset.iin;
            const select = usersList.querySelector(`.role-select[data-iin="${iin}"]`);
            const newRole = select.value;
            const result = await updateUserRole(iin, newRole);
            alert(result.message);
            await renderUsers();
        }
    });

    // Инициализация
    renderUsers();
});
