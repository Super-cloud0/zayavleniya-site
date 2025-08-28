document.addEventListener('DOMContentLoaded', () => {
    // Get all necessary DOM elements
    const statusIndicator = document.querySelector('.status-indicator');
    const burgerMenu = document.getElementById('burger-menu');
    const closeBtn = document.getElementById('close-btn');
    const mobileMenuOverlay = document.getElementById('sidebar-menu');

    // Navigation and Logout elements
    const parentAppLink = document.getElementById('parent-app-link');
    const educatorAppLink = document.getElementById('educator-app-link');
    const adminPanelLink = document.getElementById('admin-panel-link'); // Добавлено
    const parentAppLinkMobile = document.getElementById('parent-app-link-mobile');
    const educatorAppLinkMobile = document.getElementById('educator-app-link-mobile');
    const adminPanelLinkMobile = document.getElementById('admin-panel-link-mobile'); // Добавлено
    const logoutBtn = document.getElementById('logout-btn');

    // NEW elements for the index page card
    const applicationCardLink = document.getElementById('application-card-link');
    const applicationCardTitle = document.getElementById('application-card-title');
    const applicationCardDescription = document.getElementById('application-card-description');

    // Function to update status indicator, navigation, and the logout button
    function updateStatusAndNav() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userRole = localStorage.getItem('userRole');

        // Manage status indicator visibility
        if (statusIndicator) {
            if (isLoggedIn) {
                statusIndicator.classList.add('logged-in');
            } else {
                statusIndicator.classList.remove('logged-in');
            }
        }

        // Manage navigation link visibility based on role
        if (isLoggedIn) {
            // Для администратора
            if (userRole === 'admin') {
                if (parentAppLink) parentAppLink.style.display = 'none';
                if (educatorAppLink) educatorAppLink.style.display = 'none';
                if (adminPanelLink) adminPanelLink.style.display = 'block';
                if (parentAppLinkMobile) parentAppLinkMobile.style.display = 'none';
                if (educatorAppLinkMobile) educatorAppLinkMobile.style.display = 'none';
                if (adminPanelLinkMobile) adminPanelLinkMobile.style.display = 'block';
            } 
            // Для воспитателя
            else if (userRole === 'educator') {
                if (parentAppLink) parentAppLink.style.display = 'none';
                if (educatorAppLink) educatorAppLink.style.display = 'block';
                if (adminPanelLink) adminPanelLink.style.display = 'none';
                if (parentAppLinkMobile) parentAppLinkMobile.style.display = 'none';
                if (educatorAppLinkMobile) educatorAppLinkMobile.style.display = 'block';
                if (adminPanelLinkMobile) adminPanelLinkMobile.style.display = 'none';
            } 
            // Для родителя
            else { 
                if (parentAppLink) parentAppLink.style.display = 'block';
                if (educatorAppLink) educatorAppLink.style.display = 'none';
                if (adminPanelLink) adminPanelLink.style.display = 'none';
                if (parentAppLinkMobile) parentAppLinkMobile.style.display = 'block';
                if (educatorAppLinkMobile) educatorAppLinkMobile.style.display = 'none';
                if (adminPanelLinkMobile) adminPanelLinkMobile.style.display = 'none';
            }
        } else { // Для неавторизованных пользователей
            if (parentAppLink) parentAppLink.style.display = 'block';
            if (educatorAppLink) educatorAppLink.style.display = 'none';
            if (adminPanelLink) adminPanelLink.style.display = 'none';
            if (parentAppLinkMobile) parentAppLinkMobile.style.display = 'block';
            if (educatorAppLinkMobile) educatorAppLinkMobile.style.display = 'none';
            if (adminPanelLinkMobile) adminPanelLinkMobile.style.display = 'none';
        }


        // NEW: Manage the index page card based on role
        if (applicationCardLink && applicationCardTitle && applicationCardDescription) {
            if (isLoggedIn && userRole === 'admin') {
                applicationCardLink.href = 'admin.html';
                applicationCardTitle.textContent = 'Панель администратора';
                applicationCardDescription.textContent = 'Управление ролями пользователей.';
            } else if (isLoggedIn && userRole === 'educator') {
                applicationCardLink.href = 'educator.html';
                applicationCardTitle.textContent = 'Пришедшие заявления';
                applicationCardDescription.textContent = 'Просмотр и обработка заявлений учащихся.';
            } else {
                applicationCardLink.href = 'application.html';
                applicationCardTitle.textContent = 'Отправить заявление';
                applicationCardDescription.textContent = 'Подача заявления на временный уход из общежития.';
            }
        }

        // Manage logout button visibility
        if (logoutBtn) {
            if (isLoggedIn) {
                logoutBtn.style.display = 'block';
            } else {
                logoutBtn.style.display = 'none';
            }
        }
    }

    // Call the function on every page load
    updateStatusAndNav();

    // Logic for burger menu
    if (burgerMenu && closeBtn && mobileMenuOverlay) {
        burgerMenu.addEventListener('click', () => {
            mobileMenuOverlay.classList.add('active');
        });
        closeBtn.addEventListener('click', () => {
            mobileMenuOverlay.classList.remove('active');
        });
    }

    // Logic for login form (login.html)
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const iinInput = document.getElementById('iin').value;
            const passwordInput = document.getElementById('password').value;
            const messageDiv = document.getElementById('message');
            const registeredUser = JSON.parse(localStorage.getItem('registeredUser'));

            if (registeredUser && iinInput === registeredUser.iin && passwordInput === registeredUser.password) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userRole', registeredUser.role);
                messageDiv.textContent = 'Вход выполнен успешно!';
                messageDiv.style.backgroundColor = '#d4edda';
                messageDiv.style.color = '#155724';
                messageDiv.style.display = 'block';
                updateStatusAndNav();

                setTimeout(() => {
                    if (registeredUser.role === 'admin') {
                        window.location.href = 'admin.html';
                    } else if (registeredUser.role === 'educator') {
                        window.location.href = 'educator.html';
                    } else {
                        window.location.href = 'application.html';
                    }
                }, 1000);
            } else {
                localStorage.setItem('isLoggedIn', 'false');
                messageDiv.textContent = 'Неправильный ИИН или пароль!';
                messageDiv.style.color = '#a52a2a';
                messageDiv.style.backgroundColor = '#ffebeb';
                messageDiv.style.display = 'block';
                updateStatusAndNav();
            }
        });
    }

    // Logic for registration form (registration.html)
   const registrationForm = document.getElementById('registration-form');
if (registrationForm) {
    registrationForm.addEventListener('submit', async (e) => { // Добавляем 'async'
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
            // Отправляем данные на бэкенд вместо localStorage
            const response = await fetch('https://zayavleniya-site-1.onrender.com', {
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
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1000);
            } else {
                messageDiv.textContent = data.message;
                messageDiv.style.color = '#a52a2a';
                messageDiv.style.backgroundColor = '#ffebeb';
                messageDiv.style.display = 'block';
            }
        } catch (error) {
            console.error('Ошибка:', error);
            messageDiv.textContent = 'Ошибка сервера. Попробуйте еще раз позже.';
            messageDiv.style.color = '#a52a2a';
            messageDiv.style.backgroundColor = '#ffebeb';
            messageDiv.style.display = 'block';
        }
    });
}

    // Logic for application page (application.html)
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

        applicationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (localStorage.getItem('isLoggedIn') !== 'true') {
                alert('Пожалуйста, войдите в систему, чтобы отправить заявление!');
                return;
            }
            const directorName = document.getElementById('director_name').value;
            const applicationType = document.getElementById('applicationType').value;
            const parentName = document.getElementById('parent_name').value;
            const address = document.getElementById('address').value;
            const phone = document.getElementById('phone').value;
            const childClass = document.getElementById('child_class').value;
            const childName = document.getElementById('child_name').value;
            const startDate = document.getElementById('start_date').value;
            const endDate = document.getElementById('end_date').value;
            const userIIN = JSON.parse(localStorage.getItem('registeredUser')).iin;

            const applicationData = {
                iin: userIIN,
                director_name: directorName,
                application_type: applicationType,
                parent_name: parentName,
                address: address,
                phone: phone,
                child_class: childClass,
                child_name: childName,
                start_date: startDate,
                end_date: endDate,
                status: 'pending',
                timestamp: new Date().toISOString()
            };
            let applications = JSON.parse(localStorage.getItem('applications')) || [];
            applications.push(applicationData);
            localStorage.setItem('applications', JSON.stringify(applications));
            applicationMessageDiv.textContent = 'Ваше заявление успешно отправлено!';
            applicationMessageDiv.style.backgroundColor = '#d4edda';
            applicationMessageDiv.style.color = '#155724';
            applicationMessageDiv.style.display = 'block';
            applicationForm.reset();
            setTimeout(() => {
                applicationMessageDiv.style.display = 'none';
            }, 5000);
        });
    }

    // Logic for logging out
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userRole');
            localStorage.removeItem('registeredUser'); // Добавлено
            window.location.href = 'index.html';
        });
    }
});
