document.addEventListener('DOMContentLoaded', () => {
    const applicationsList = document.getElementById('applications-list');
    const noApplicationsMessage = document.getElementById('no-applications-message');

    // Проверяем, авторизован ли пользователь и имеет ли он роль воспитателя
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'educator') {
        window.location.href = 'index.html';
        return;
    }

    // Функция загрузки заявлений с сервера
    async function fetchApplicationsFromServer() {
        try {
            const response = await fetch('https://zayavleniya-site-1.onrender.com/applications');
            if (!response.ok) throw new Error("Ошибка загрузки заявлений");
            const data = await response.json();
            renderApplications(data);
        } catch (err) {
            noApplicationsMessage.textContent = "Ошибка загрузки заявлений: " + err.message;
            noApplicationsMessage.style.display = 'block';
        }
    }

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

    // Функция генерации и скачивания Word-документа
async function generateDocx(app) {
    const templateUrl = 'application_template.docx'; // поправьте путь при необходимости
    try {
        const response = await fetch(templateUrl);
        console.log('Template fetch url:', response.url, 'status:', response.status, 'content-type:', response.headers.get('content-type'));

        if (!response.ok) throw new Error("Не найден шаблон docx (status " + response.status + ")");

        const contentType = response.headers.get('content-type') || '';
        const buffer = await response.arrayBuffer();
        const bytes = new Uint8Array(buffer);

        // проверка: docx — zip, начинается с 'PK' (0x50 0x4B)
        if (bytes.length < 4 || bytes[0] !== 0x50 || bytes[1] !== 0x4B) {
            // если сервер отдал HTML вместо docx — попытаемся прочесть начало как строку для отладки
            const start = new TextDecoder().decode(bytes.subarray(0, Math.min(200, bytes.length)));
            console.error('Получен не-docx. Начало файла:', start);
            throw new Error('Шаблон docx не найден или возвращён HTML. Проверьте путь и конфигурацию сервера.');
        }

        const zip = new PizZip(buffer);
        const doc = new window.docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        doc.setData({
            application_type: app.application_type,
            child_name: app.child_name,
            child_class: app.child_class,
            parent_name: app.parent_name,
            phone: app.phone,
            start_date: app.start_date,
            end_date: app.end_date,
        });

        try {
            doc.render();
        } catch (error) {
            console.error('docxtemplater render error', error);
            alert('Ошибка при формировании документа: ' + (error.message || error));
            return;
        }

        const out = doc.getZip().generate({
            type: "blob",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        saveAs(out, `Заявление_${app.child_name || 'без_ФИО'}_${app.start_date || 'дата'}.docx`);
    } catch (err) {
        alert("Ошибка при генерации документа: " + err.message);
    }
}


    // Делегируем обработчики кнопок (только один раз!)
    applicationsList.addEventListener('click', async (e) => {
        const appId = e.target.dataset.id;
        if (!appId) return;

        if (e.target.classList.contains('approve-btn')) {
            await fetch(`https://zayavleniya-site-1.onrender.com/applications/${appId}/approve`, { method: 'PATCH' });
            fetchApplicationsFromServer();
        }
        else if (e.target.classList.contains('reject-btn')) {
            await fetch(`https://zayavleniya-site-1.onrender.com/applications/${appId}/reject`, { method: 'PATCH' });
            fetchApplicationsFromServer();
        }
        else if (e.target.classList.contains('delete-btn')) {
            await fetch(`https://zayavleniya-site-1.onrender.com/applications/${appId}`, { method: 'DELETE' });
            fetchApplicationsFromServer();
        }
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

    // Стартуем загрузку заявлений
    fetchApplicationsFromServer();
});
