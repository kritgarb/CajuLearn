// URL do backend
const BACKEND_URL = 'http://localhost:5000';  // Ajuste para a URL correta quando fizer o deploy

// Lógica para login
document.getElementById('login-form')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Enviar requisição de login para o backend
    const response = await fetch(`${BACKEND_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
        // Armazenar o token JWT no sessionStorage
        sessionStorage.setItem('token', data.access_token);
        alert('Login bem-sucedido!');
        // Redirecionar para a dashboard com base no perfil do usuário
        const payload = JSON.parse(atob(data.access_token.split('.')[1]));
        if (payload.role === 'professor') {
            window.location.href = 'client/pages/dashboard-professor.html';
        } else {
            window.location.href = 'client/pages/dashboard-aluno.html';
        }
    } else {
        alert('Credenciais inválidas.');
    }
});

// Lógica para registro
document.getElementById('register-form')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    // Enviar requisição de registro para o backend
    const response = await fetch(`${BACKEND_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
    });

    if (response.ok) {
        alert(`Usuário ${email} registrado com sucesso!`);
        window.location.href = '../../index.html';
    } else {
        alert('Erro ao registrar usuário.');
    }
});

// Lógica para logout
document.getElementById('logout')?.addEventListener('click', function () {
    sessionStorage.removeItem('token');
    alert('Você saiu da conta.');
    window.location.href = '../../index.html';
});
