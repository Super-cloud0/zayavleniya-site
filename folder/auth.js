document.addEventListener('DOMContentLoaded', () => {
    // DOM элементы навигации (десктоп и мобильная)
    const statusIndicator = document.querySelector('.status-indicator');
    const burgerMenu = document.getElementById('burger-menu');
    const closeBtn = document.getElementById('close-btn');
    const mobileMenuOverlay = document.getElementById('sidebar-menu');
    // Десктоп
    const parentAppLink = document.getElementById('parent-app-link');
    const parentMyAppLink = document.getElementById('parent-my-app-link');
    const educatorAppLink = document.getElementById('educator-app-link');
    const adminPanelLink = document.getElementById('admin-panel-link');
    // Мобильная
    const parentAppLinkMobile = document.getElementById('parent-app-link-mobile');
    const parentMyAppLinkMobile = document.getElementById('parent-my-app-link-mobile');
    const educatorAppLinkMobile = document.getElementById('educator-app-link-mobile');
    const adminPanelLinkMobile = document.getElementById('admin-panel-link-mobile');
    // Кнопка выхода
    const logoutBtn = document.getElementById('logout-btn');
    // Карточка на главной
    const applicationCardLink = document.getElementById('application-card-link');
    const applicationCardTitle = document.getElementById('application-card-title');
    const applicationCardDescription = document.getElementById('application-card-description');

    // Обновление навигации и статуса
    function updateStatusAndNav() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userRole = localStorage.getItem('userRole');

        // Индикатор статуса
        if (statusIndicator) {
            if (isLoggedIn) statusIndicator.classList.add('logged-in');
            else statusIndicator.classList.remove('logged-in');
        }

        // Навигация (отображение пунктов)
        if (isLoggedIn) {
            if (userRole === 'admin') {
                // Только админ
                if (parentAppLink) parentAppLink.style.display = 'none';
                if (parentMyAppLink) parentMyAppLink.style.display = 'none';
                if (educatorAppLink) educatorAppLink.style.display = 'none';
                if (adminPanelLink) adminPanelLink.style.display = 'block';
                if (parentAppLinkMobile) parentAppLinkMobile.style.display = 'none';
                if (parentMyAppLinkMobile) parentMyAppLinkMobile.style.display = 'none';
                if (educatorAppLinkMobile) educatorAppLinkMobile.style.display = 'none';
                if (adminPanelLinkMobile) adminPanelLinkMobile.style.display = 'block';
            } else if (userRole === 'educator') {
                // Только воспитатель
                if (parentAppLink) parentAppLink.style.display = 'none';
                if (parentMyAppLink) parentMyAppLink.style.display = 'none';
                if (educatorAppLink) educatorAppLink.style.display = 'block';
                if (adminPanelLink) adminPanelLink.style.display = 'none';
                if (parentAppLinkMobile) parentAppLinkMobile.style.display = 'none';
                if (parentMyAppLinkMobile) parentMyAppLinkMobile.style.display = 'none';
                if (educatorAppLinkMobile) educatorAppLinkMobile.style.display = 'block';
                if (adminPanelLinkMobile) adminPanelLinkMobile.style.display = 'none';
            } else if (userRole === 'parent') {
                // Только родитель
                if (parentAppLink) parentAppLink.style.display = 'block';
                if (parentMyAppLink) parentMyAppLink.style.display = 'block';
                if (educatorAppLink) educatorAppLink.style.display = 'none';
                if (adminPanelLink) adminPanelLink.style.display = 'none';
                if (parentAppLinkMobile) parentAppLinkMobile.style.display = 'block';
                if (parentMyAppLinkMobile) parentMyAppLinkMobile.style.display = 'block';
                if (educatorAppLinkMobile) educatorAppLinkMobile.style.display = 'none';
                if (adminPanelLinkMobile) adminPanelLinkMobile.style.display = 'none';
            } else {
                // fallback: только "отправить заявление"
                if (parentAppLink) parentAppLink.style.display = 'block';
                if (parentMyAppLink) parentMyAppLink.style.display = 'none';
                if (educatorAppLink) educatorAppLink.style.display = 'none';
                if (adminPanelLink) adminPanelLink.style.display = 'none';
                if (parentAppLinkMobile) parentAppLinkMobile.style.display = 'block';
                if (parentMyAppLinkMobile) parentMyAppLinkMobile.style.display = 'none';
                if (educatorAppLinkMobile) educatorAppLinkMobile.style.display = 'none';
                if (adminPanelLinkMobile) adminPanelLinkMobile.style.display = 'none';
            }
        } else {
            // Неавторизованный
            if (parentAppLink) parentAppLink.style.display = 'block';
            if (parentMyAppLink) parentMyAppLink.style.display = 'none';
            if (educatorAppLink) educatorAppLink.style.display = 'none';
            if (adminPanelLink) adminPanelLink.style.display = 'none';
            if (parentAppLinkMobile) parentAppLinkMobile.style.display = 'block';
            if (parentMyAppLinkMobile) parentMyAppLinkMobile.style.display = 'none';
            if (educatorAppLinkMobile) educatorAppLinkMobile.style.display = 'none';
            if (adminPanelLinkMobile) adminPanelLinkMobile.style.display = 'none';
        }

        // Главная карточка
        if (applicationCardLink && applicationCardTitle && applicationCardDescription) {
            if (isLoggedIn && userRole === 'admin') {
                applicationCardLink.href = 'admin.html';
                applicationCardTitle.textContent = 'Панель администратора';
                applicationCardDescription.textContent = 'Управление ролями пользователей.';
            } else if (isLoggedIn && userRole === 'educator') {
                applicationCardLink.href = 'educator.html';
                applicationCardTitle.textContent = 'Пришедшие заявления';
                applicationCardDescription.textContent = 'Просмотр и обработка заявлений учащихся.';
            } else if (isLoggedIn && userRole === 'parent') {
                applicationCardLink.href = 'application.html';
                applicationCardTitle.textContent = 'Отправить заявление';
                applicationCardDescription.textContent = 'Подача заявления на временный уход из общежития.';
            } else {
                applicationCardLink.href = 'application.html';
                applicationCardTitle.textContent = 'Отправить заявление';
                applicationCardDescription.textContent = 'Подача заявления на временный уход из общежития.';
            }
        }

        // Кнопка выхода
        if (logoutBtn) logoutBtn.style.display = isLoggedIn ? 'block' : 'none';
    }

    updateStatusAndNav();

    // Бургер-меню
    if (burgerMenu && closeBtn && mobileMenuOverlay) {
        burgerMenu.addEventListener('click', () => {
            mobileMenuOverlay.classList.add('active');
        });
        closeBtn.addEventListener('click', () => {
            mobileMenuOverlay.classList.remove('active');
        });
    }

    // Логика формы входа
   const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = 'Проверка...';
        messageDiv.style.backgroundColor = '#fff8db';
        messageDiv.style.color = '#856404';
        messageDiv.style.display = 'block';
        const iinInput = document.getElementById('iin').value;
        const passwordInput = document.getElementById('password').value;
        const credentials = { iin: iinInput, password: passwordInput };

        try {
            const response = await fetch('https://zayavleniya-site-1.onrender.com/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userRole', data.role);
                localStorage.setItem('iin', data.iin);
                messageDiv.textContent = 'Вход выполнен успешно!';
                messageDiv.style.backgroundColor = '#d4edda';
                messageDiv.style.color = '#155724';
                messageDiv.style.display = 'block';
                updateStatusAndNav();
                setTimeout(() => {
                    if (data.role === 'admin') window.location.href = 'admin.html';
                    else if (data.role === 'educator') window.location.href = 'educator.html';
                    else window.location.href = 'application.html';
                }, 1000);
            } else {
                localStorage.setItem('isLoggedIn', 'false');
                messageDiv.textContent = data.message;
                messageDiv.style.color = '#a52a2a';
                messageDiv.style.backgroundColor = '#ffebeb';
                messageDiv.style.display = 'block';
                updateStatusAndNav();
            }
        } catch (error) {
            messageDiv.textContent = 'Ошибка сервера. Попробуйте еще раз позже.';
            messageDiv.style.color = '#a52a2a';
            messageDiv.style.backgroundColor = '#ffebeb';
            messageDiv.style.display = 'block';
        }
    });
}

    // Логика формы регистрации
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const iinInput = document.getElementById('iin').value;
            const passwordInput = document.getElementById('password').value;
            const confirmPasswordInput = document.getElementById('confirm_password').value;
            const messageDiv = document.getElementById('message');

            if (passwordInput !== confirmPasswordInput) {
                messageDiv.textContent = 'Пароли не совпадают!';
                messageDiv.style.color = '#a52a2a';
                messageDiv.style.backgroundColor = '#ffebeb';
                messageDiv.style.display = 'block';
                return;
            }

            const user = { iin: iinInput, password: passwordInput, role: 'parent' };

            try {
                const response = await fetch('https://zayavleniya-site-1.onrender.com/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(user)
                });

                const data = await response.json();

                if (response.ok) {
                    messageDiv.textContent = data.message;
                    messageDiv.style.backgroundColor = '#d4edda';
                    messageDiv.style.color = '#155724';
                    messageDiv.style.display = 'block';
                    setTimeout(() => { window.location.href = 'login.html'; }, 1000);
                } else {
                    messageDiv.textContent = data.message;
                    messageDiv.style.color = '#a52a2a';
                    messageDiv.style.backgroundColor = '#ffebeb';
                    messageDiv.style.display = 'block';
                }
            } catch (error) {
                messageDiv.textContent = 'Ошибка сервера. Попробуйте еще раз позже.';
                messageDiv.style.color = '#a52a2a';
                messageDiv.style.backgroundColor = '#ffebeb';
                messageDiv.style.display = 'block';
            }
        });
    }

    // Логика формы заявления
    const applicationForm = document.getElementById('application-form');
    const submitButton = document.getElementById('submit-button');
    const applicationMessageDiv = document.getElementById('application-message');

    if (applicationForm && submitButton) {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            submitButton.disabled = false;
            submitButton.textContent = 'Отправить заявление';
            submitButton.style.backgroundColor = '';
        } else {
            submitButton.disabled = true;
            submitButton.textContent = 'Войдите, чтобы отправить';
            submitButton.style.backgroundColor = '#ccc';
        }

        applicationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (localStorage.getItem('isLoggedIn') !== 'true') {
                alert('Пожалуйста, войдите в систему, чтобы отправить заявление!');
                return;
            }
            const iin = localStorage.getItem('iin');
            const directorName = document.getElementById('director_name').value;
            const applicationType = document.getElementById('applicationType').value;
            const parentName = document.getElementById('parent_name').value;
            const address = document.getElementById('address').value;
            const phone = document.getElementById('phone').value;
            const childClass = document.getElementById('child_class').value;
            const childName = document.getElementById('child_name').value;
            const startDate = document.getElementById('start_date').value;
            const endDate = document.getElementById('end_date').value;

            const applicationData = {
                iin: iin,
                director_name: directorName,
                application_type: applicationType,
                parent_name: parentName,
                address: address,
                phone: phone,
                child_class: childClass,
                child_name: childName,
                start_date: startDate,
                end_date: endDate
            };

            try {
                const response = await fetch('https://zayavleniya-site-1.onrender.com/applications', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(applicationData)
                });

                const data = await response.json();

                if (response.ok) {
                    applicationMessageDiv.textContent = 'Ваше заявление успешно отправлено!';
                    applicationMessageDiv.style.backgroundColor = '#d4edda';
                    applicationMessageDiv.style.color = '#155724';
                    applicationMessageDiv.style.display = 'block';
                    applicationForm.reset();
                } else {
                    applicationMessageDiv.textContent = data.message || 'Ошибка при отправке заявления.';
                    applicationMessageDiv.style.backgroundColor = '#ffebeb';
                    applicationMessageDiv.style.color = '#a52a2a';
                    applicationMessageDiv.style.display = 'block';
                }
            } catch (error) {
                applicationMessageDiv.textContent = 'Ошибка сервера. Попробуйте еще раз позже.';
                applicationMessageDiv.style.backgroundColor = '#ffebeb';
                applicationMessageDiv.style.color = '#a52a2a';
                applicationMessageDiv.style.display = 'block';
            }
        });
    }

    // Логика выхода
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userRole');
            localStorage.removeItem('iin');
            window.location.href = 'index.html';
        });
    }
});
