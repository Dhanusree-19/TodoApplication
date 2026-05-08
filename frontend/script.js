document.addEventListener('DOMContentLoaded', () => {
    const BACKEND_URL = 'http://localhost:8080';
    const API_BASE_URL = window.location.origin === BACKEND_URL ? '' : BACKEND_URL;
    let loggedInUsername = '';
    let loggedInPassword = '';

    const authView = document.getElementById('auth-view');
    const todoView = document.getElementById('todo-view');
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginFormElement = document.getElementById('login-form-element');
    const registerFormElement = document.getElementById('register-form-element');
    const loginMessage = document.getElementById('login-message');
    const registerMessage = document.getElementById('register-message');
    const signedInUser = document.getElementById('signed-in-user');
    const logoutBtn = document.getElementById('logout-btn');
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const emptyState = document.getElementById('empty-state');
    const todoMessage = document.getElementById('todo-message');

    const setMessage = (element, text, type = 'error') => {
        element.textContent = text;
        element.className = `message ${type}`;
    };

    const clearMessages = () => {
        [loginMessage, registerMessage, todoMessage].forEach((element) => setMessage(element, '', ''));
    };

    const showLogin = () => {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        clearMessages();
    };

    const showRegister = () => {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
        clearMessages();
    };

    const showTodos = (username) => {
        authView.classList.add('hidden');
        todoView.classList.remove('hidden');
        signedInUser.textContent = username ? `Signed in as ${username}` : '';
    };

    const showAuth = () => {
        todoView.classList.add('hidden');
        authView.classList.remove('hidden');
        signedInUser.textContent = '';
        todoList.innerHTML = '';
        showLogin();
    };

    const requestJson = async (url, options = {}) => {
        let response;
        const { authenticated = false, headers: customHeaders = {}, ...fetchOptions } = options;
        const headers = {
            'Content-Type': 'application/json',
            ...customHeaders
        };

        if (authenticated && loggedInUsername && loggedInPassword) {
            headers.Authorization = `Basic ${btoa(`${loggedInUsername}:${loggedInPassword}`)}`;
        }

        try {
            response = await fetch(`${API_BASE_URL}${url}`, {
                credentials: 'include',
                headers,
                ...fetchOptions
            });
        } catch (error) {
            throw new Error('Cannot reach backend. Start Spring Boot on http://localhost:8080/');
        }

        const contentType = response.headers.get('content-type') || '';
        const data = contentType.includes('application/json') ? await response.json() : await response.text();

        if (!response.ok) {
            const message = typeof data === 'string' ? data : data.message || 'Request failed';
            throw new Error(`${response.status}: ${message}`);
        }

        return data;
    };

    const loadTodos = async () => {
        try {
            const todos = await requestJson('/todos', { authenticated: true });
            todoList.innerHTML = '';
            todos.forEach(renderTodo);
            emptyState.classList.toggle('hidden', todos.length > 0);
        } catch (error) {
            setMessage(todoMessage, error.message || 'Could not load todos.');
        }
    };

    const renderTodo = (todo) => {
        const item = document.createElement('li');
        item.className = 'todo-item';
        item.dataset.id = todo.id;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.setAttribute('aria-label', `Mark ${todo.task} complete`);

        const task = document.createElement('span');
        task.textContent = todo.task;
        task.className = todo.completed ? 'completed' : '';

        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.className = 'icon-btn';
        editBtn.textContent = 'Rename';

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'icon-btn';
        deleteBtn.textContent = 'Delete';

        checkbox.addEventListener('change', async () => {
            try {
                const updated = await requestJson(`/todos/${todo.id}`, {
                    method: 'PUT',
                    authenticated: true,
                    body: JSON.stringify({ task: todo.task, completed: checkbox.checked })
                });
                task.className = updated.completed ? 'completed' : '';
                clearMessages();
            } catch (error) {
                checkbox.checked = !checkbox.checked;
                setMessage(todoMessage, error.message || 'Could not update todo.');
            }
        });

        editBtn.addEventListener('click', async () => {
            const newTask = prompt('Rename task', task.textContent);

            if (newTask === null || !newTask.trim()) {
                return;
            }

            try {
                const updated = await requestJson(`/todos/${todo.id}`, {
                    method: 'PUT',
                    authenticated: true,
                    body: JSON.stringify({ task: newTask.trim(), completed: checkbox.checked })
                });
                todo.task = updated.task;
                task.textContent = updated.task;
                clearMessages();
            } catch (error) {
                setMessage(todoMessage, error.message || 'Could not rename todo.');
            }
        });

        deleteBtn.addEventListener('click', async () => {
            try {
                await requestJson(`/todos/${todo.id}`, { method: 'DELETE', authenticated: true });
                item.remove();
                emptyState.classList.toggle('hidden', todoList.children.length > 0);
                clearMessages();
            } catch (error) {
                setMessage(todoMessage, error.message || 'Could not delete todo.');
            }
        });

        item.append(checkbox, task, editBtn, deleteBtn);
        todoList.appendChild(item);
    };

    loginTab.addEventListener('click', showLogin);
    registerTab.addEventListener('click', showRegister);

    registerFormElement.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('reg-username').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;

        if (password !== confirmPassword) {
            setMessage(registerMessage, 'Passwords do not match.');
            return;
        }

        try {
            const message = await requestJson('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });
            setMessage(registerMessage, message, 'success');
            registerFormElement.reset();
            showLogin();
            setMessage(loginMessage, 'Account created. You can log in now.', 'success');
        } catch (error) {
            setMessage(registerMessage, error.message || 'Error registering user.');
        }
    });

    loginFormElement.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;

        try {
            await requestJson('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });
            loggedInUsername = username;
            loggedInPassword = password;
            loginFormElement.reset();
            showTodos(username);
            await loadTodos();
        } catch (error) {
            setMessage(loginMessage, error.message || 'Invalid username or password.');
        }
    });

    todoForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const task = todoInput.value.trim();
        if (!task) {
            return;
        }

        try {
            const todo = await requestJson('/todos', {
                method: 'POST',
                authenticated: true,
                body: JSON.stringify({ task })
            });
            renderTodo(todo);
            todoInput.value = '';
            emptyState.classList.add('hidden');
            clearMessages();
        } catch (error) {
            setMessage(todoMessage, error.message || 'Could not add todo.');
        }
    });

    logoutBtn.addEventListener('click', async () => {
        try {
            await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
        } finally {
            loggedInUsername = '';
            loggedInPassword = '';
            showAuth();
        }
    });
});
