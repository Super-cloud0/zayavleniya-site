document.addEventListener('DOMContentLoaded', () => {
    const applicationsList = document.getElementById('applications-list');
    const noApplicationsMessage = document.getElementById('no-applications-message');

    // Проверяем, авторизован ли пользователь и имеет ли он роль воспитателя
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'educator') {
        window.location.href = 'index.html';
        return;
    }

    // Загружаем заявления с сервера
   // ... (часть кода выше без изменений)

// Функция генерации и скачивания Word-документа
async function generateDocx(app) {
    // Пример шаблона docx, если используется docxtemplater
    const templateUrl = '/templates/application_template.docx'; // путь к шаблону
    const response = await fetch(templateUrl);
    const content = await response.arrayBuffer();

    const zip = new PizZip(content);
    const doc = new window.docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });

    // Подставьте свои поля
    doc.setData({
        application_type: app.application_type,
        child_name: app.child_name,
        child_class: app.child_class,
        parent_name: app.parent_name,
        phone: app.phone,
        start_date: app.start_date,
        end_date: app.end_date,
        // ...добавьте нужные поля
    });

    try {
        doc.render();
    } catch (error) {
        alert('Ошибка при формировании документа: ' + error.message);
        return;
    }

    const out = doc.getZip().generate({
        type: "blob",
        mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    saveAs(out, `Заявление_${app.child_name}_${app.start_date}.docx`);
}

// Делегируем обработчики кнопок
applicationsList.addEventListener('click', async (e) => {
    const appId = e.target.dataset.id;
    if (!appId) return;

    // approve
    if (e.target.classList.contains('approve-btn')) {
        await fetch(`https://zayavleniya-site-1.onrender.com/applications/${appId}/approve`, { method: 'PATCH' });
        fetchApplicationsFromServer();
    }
    // reject
    else if (e.target.classList.contains('reject-btn')) {
        await fetch(`https://zayavleniya-site-1.onrender.com/applications/${appId}/reject`, { method: 'PATCH' });
        fetchApplicationsFromServer();
    }
    // delete
    else if (e.target.classList.contains('delete-btn')) {
        await fetch(`https://zayavleniya-site-1.onrender.com/applications/${appId}`, { method: 'DELETE' });
        fetchApplicationsFromServer();
    }
    // download
    else if (e.target.classList.contains('download-btn')) {
        try {
            const response = await fetch(`https://zayavleniya-site-1.onrender.com/applications/${appId}`);
            if (!response.ok) throw new Error('Не удалось получить данные заявления');
            const app = await response.json();
            await generateDocx(app);
        } catch (err) {
            alert('Ошибка при скачивании заявления: ' + err.message);
        }
    }
});

// ... (остальной код без изменений)

    // Отрисовка заявлений
    function renderApplications(applications) {
        if (!applications || applications.length === 0) {
            noApplicationsMessage.style.display = 'block';
            applicationsList.innerHTML = '';
            return;
        }
        applicationsList.innerHTML = '';
        noApplicationsMessage.style.display = 'none';

        applications.forEach((app, index) => {
            const applicationCard = document.createElement('div');
            applicationCard.classList.add('application-card');
            
            let statusClass = '';
            let actionButtons = '';

            if (app.status === 'pending') {
                statusClass = 'status-pending';
                actionButtons = `
                    <button class="approve-btn" data-id="${app._id}">Одобрить</button>
                    <button class="reject-btn" data-id="${app._id}">Отклонить</button>
                `;
            } else if (app.status === 'approved') {
                statusClass = 'status-approved';
                actionButtons = `
                    <button class="download-btn" data-id="${app._id}">Скачать еще раз</button>
                    <button class="delete-btn" data-id="${app._id}">Удалить</button>
                `;
            } else if (app.status === 'rejected') {
                statusClass = 'status-rejected';
                actionButtons = `
                    <button class="delete-btn" data-id="${app._id}">Удалить</button>
                `;
            }

            applicationCard.innerHTML = `
                <h3>Заявление №${index + 1}</h3>
                <p><strong>Тип:</strong> ${app.application_type}</p>
                <p><strong>ФИО учащегося:</strong> ${app.child_name}</p>
                <p><strong>Класс:</strong> ${app.child_class}</p>
                <p><strong>ФИО родителя:</strong> ${app.parent_name}</p>
                <p><strong>Номер телефона:</strong> ${app.phone}</p>
                <p><strong>Даты:</strong> ${app.start_date} - ${app.end_date}</p>
                <p><strong>Статус:</strong> <span class="${statusClass}">${app.status}</span></p>
                <div class="application-actions">
                    ${actionButtons}
                </div>
            `;
            applicationsList.appendChild(applicationCard);
        });
    }

    // Функция для генерации и скачивания Word-документа (оставь как есть)

    // Делегируем обработчики кнопок
    applicationsList.addEventListener('click', async (e) => {
        const appId = e.target.dataset.id;
        if (!appId) return;

        // approve
        if (e.target.classList.contains('approve-btn')) {
            await fetch(`https://zayavleniya-site-1.onrender.com/applications/${appId}/approve`, { method: 'PATCH' });
            fetchApplicationsFromServer();
        }
        // reject
        else if (e.target.classList.contains('reject-btn')) {
            await fetch(`https://zayavleniya-site-1.onrender.com/applications/${appId}/reject`, { method: 'PATCH' });
            fetchApplicationsFromServer();
        }
        // delete
        else if (e.target.classList.contains('delete-btn')) {
            await fetch(`https://zayavleniya-site-1.onrender.com/applications/${appId}`, { method: 'DELETE' });
            fetchApplicationsFromServer();
        }
        // download
        else if (e.target.classList.contains('download-btn')) {
            // Найди заявление по ID и вызови generateDocx
            const response = await fetch(`https://zayavleniya-site-1.onrender.com/applications/${appId}`);
            const app = await response.json();
            await generateDocx(app);
        }
    });

    // Стартуем загрузку заявлений
    fetchApplicationsFromServer();
});
