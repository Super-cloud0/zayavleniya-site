document.addEventListener('DOMContentLoaded', () => {
    // Проверка авторизации и роли
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');
    const iin = localStorage.getItem('iin');
    if (!isLoggedIn || userRole !== 'parent' || !iin) {
        window.location.href = 'index.html';
        return;
    }

    const applicationsList = document.getElementById('my-applications-list');
    const noApplicationsMessage = document.getElementById('no-my-applications-message');

    async function fetchMyApplications() {
        const response = await fetch(`https://zayavleniya-site-1.onrender.com/my-applications/${iin}`);
        return await response.json();
    }

    async function renderMyApplications() {
        const applications = await fetchMyApplications();
        if (!applications || applications.length === 0) {
            noApplicationsMessage.style.display = 'block';
            applicationsList.innerHTML = '';
            return;
        }
        noApplicationsMessage.style.display = 'none';
        applicationsList.innerHTML = '';

        applications.forEach((app, idx) => {
            const card = document.createElement('div');
            card.classList.add('application-card');
            let statusClass = '';
            if (app.status === 'pending') statusClass = 'status-pending';
            if (app.status === 'approved') statusClass = 'status-approved';
            if (app.status === 'rejected') statusClass = 'status-rejected';

            card.innerHTML = `
                <h3>Заявление №${idx + 1}</h3>
                <p><strong>Тип:</strong> ${app.application_type}</p>
                <p><strong>ФИО учащегося:</strong> ${app.child_name}</p>
                <p><strong>Класс:</strong> ${app.child_class}</p>
                <p><strong>Даты:</strong> ${app.start_date} - ${app.end_date}</p>
                <p><strong>Статус:</strong> <span class="${statusClass}">${app.status}</span></p>
            `;
            applicationsList.appendChild(card);
        });
    }

    renderMyApplications();
});
