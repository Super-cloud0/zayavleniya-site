document.addEventListener('DOMContentLoaded', () => {
    const applicationsList = document.getElementById('applications-list');
    const noApplicationsMessage = document.getElementById('no-applications-message');

    // Проверяем, авторизован ли пользователь и имеет ли он роль воспитателя
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'educator') {
        window.location.href = 'index.html';
        return; 
    }

    function renderApplications() {
        const applications = JSON.parse(localStorage.getItem('applications')) || [];

        if (applications.length === 0) {
            noApplicationsMessage.style.display = 'block';
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
                    <button class="approve-btn" data-index="${index}">Одобрить</button>
                    <button class="reject-btn" data-index="${index}">Отклонить</button>
                `;
            } else if (app.status === 'approved') {
                statusClass = 'status-approved';
                actionButtons = `
                    <button class="download-btn" data-index="${index}">Скачать еще раз</button>
                    <button class="delete-btn" data-index="${index}">Удалить</button>
                `;
            } else if (app.status === 'rejected') {
                statusClass = 'status-rejected';
                actionButtons = `
                    <button class="delete-btn" data-index="${index}">Удалить</button>
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

    // Функция для генерации и скачивания Word-документа
   async function generateDocx(data) {
        try {
            const response = await fetch('./ЗАЯВЛЕНИЕ О ВРЕМЕННОМ УХОДЕ (2).docx');
            const content = await response.arrayBuffer();

            const zip = new PizZip(content);
            const doc = new docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
            });

            // Определяем текст в зависимости от типа заявления
            let applicationText = '';
            if (data.application_type === 'weekend') {
                applicationText = `с ${data.start_date} по ${data.end_date} года на выходные дни.`;
            } else if (data.application_type === 'health') {
                applicationText = `с ${data.start_date} по ${data.end_date} года по состоянию здоровья.`;
            } else if (data.application_type === 'family') {
                applicationText = `с ${data.start_date} по ${data.end_date} года по семейным обстоятельствам.`;
            } else if (data.application_type === 'health_family') {
                applicationText = `с ${data.start_date} по ${data.end_date} года по состоянию здоровья/по семейным обстоятельствам.`;
            } else if (data.application_type === 'holidays') {
                applicationText = `с ${data.start_date} по ${data.end_date} года на каникулы.`;
            } else {
                applicationText = `с ${data.start_date} по ${data.end_date} года по неуказанной причине.`;
            }
            
            // Форматируем дату подачи
            const submissionDate = new Date(data.timestamp).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });

            // Заполняем документ данными
            doc.setData({
                parent_name: data.parent_name,
                address: data.address,
                phone: data.phone,
                child_name: data.child_name,
                child_class: data.child_class,
                dates: applicationText,
                submission_date: submissionDate
            });

            doc.render();

            const out = doc.getZip().generate({
                type: 'blob',
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            });
            
            saveAs(out, `Заявление_${data.child_name}.docx`);

        } catch (error) {
            console.error("Ошибка при создании документа:", error);
            alert("Ошибка при создании документа. Пожалуйста, попробуйте еще раз.");
        }
    }

    renderApplications();

    // Добавляем обработчики для кнопок
    applicationsList.addEventListener('click', async (e) => {
        const index = e.target.dataset.index;
        let applications = JSON.parse(localStorage.getItem('applications'));
        
        if (e.target.classList.contains('approve-btn')) {
            applications[index].status = 'approved';
            localStorage.setItem('applications', JSON.stringify(applications));
            await generateDocx(applications[index]);
            renderApplications();
        } else if (e.target.classList.contains('reject-btn')) {
            applications[index].status = 'rejected';
            localStorage.setItem('applications', JSON.stringify(applications));
            renderApplications();
        } else if (e.target.classList.contains('delete-btn')) {
            applications.splice(index, 1);
            localStorage.setItem('applications', JSON.stringify(applications));
            renderApplications();
        } else if (e.target.classList.contains('download-btn')) {
            await generateDocx(applications[index]);
        }
    });
});
