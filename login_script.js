// Seleção de elementos principais
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorMessageDiv = document.getElementById('error-message');
const registerErrorMessage = document.getElementById('register-error-message');

// Função para alternar entre os formulários de login e registro
function toggleForms(form) {
    if (form === 'login') {
        loginForm.classList.remove('oculto');
        registerForm.classList.add('oculto');
    } else {
        loginForm.classList.add('oculto');
        registerForm.classList.remove('oculto');
    }
}

// Função de registro de usuário
registerForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value.trim();
    const confirmPassword = document.getElementById('register-confirm-password').value.trim();

    // Validação: Campos preenchidos
    if (!username || !password || !confirmPassword) {
        registerErrorMessage.textContent = 'Por favor, preencha todos os campos.';
        return;
    }

    // Validação: Senhas iguais
    if (password !== confirmPassword) {
        registerErrorMessage.textContent = 'As senhas não coincidem.';
        return;
    }

    // Validação: Comprimento da senha
    if (password.length < 8) {
        registerErrorMessage.textContent = 'A senha deve ter pelo menos 8 caracteres.';
        return;
    }

    // Validação: Usuário único
    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(user => user.username === username)) {
        registerErrorMessage.textContent = 'Usuário já existe.';
        return;
    }

    // Registro do usuário
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));

    alert('Conta criada com sucesso! Agora você pode fazer login.');
    toggleForms('login');
});

// Função de login de usuário
loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Validação: Campos preenchidos
    if (!username || !password) {
        errorMessageDiv.textContent = 'Por favor, preencha todos os campos.';
        return;
    }

    // Validação de credenciais
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        alert('Login bem-sucedido!');
        window.location.href = 'index.html'; // Redirecionar para a página principal
    } else {
        errorMessageDiv.textContent = 'Usuário ou senha incorretos.';
    }
});

// Função "Esqueci a senha"
function esqueciSenha() {
    const username = prompt('Digite seu nome de usuário:');
    if (!username) return;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.username === username);

    if (user) {
        const novaSenha = prompt('Digite sua nova senha (mínimo 8 caracteres):');
        if (novaSenha && novaSenha.length >= 8) {
            user.password = novaSenha;
            localStorage.setItem('users', JSON.stringify(users));
            alert('Senha redefinida com sucesso!');
        } else {
            alert('Senha inválida. Deve conter pelo menos 8 caracteres.');
        }
    } else {
        alert('Usuário não encontrado.');
    }
}

// Função para alternar contraste alto
const botaoAcessibilidadeLogin = document.createElement('button');
botaoAcessibilidadeLogin.id = 'botaoContrasteLogin';
botaoAcessibilidadeLogin.textContent = 'Ativar Contraste Alto';
botaoAcessibilidadeLogin.classList.add('acessibilidade-botao');
document.body.appendChild(botaoAcessibilidadeLogin);

botaoAcessibilidadeLogin.addEventListener('click', () => {
    const body = document.body;
    const contrasteAtivo = body.classList.toggle('contraste-alto');
    botaoAcessibilidadeLogin.textContent = contrasteAtivo ? 'Desativar Contraste Alto' : 'Ativar Contraste Alto';
});

// Adicionar estilos para o contraste alto
const estiloContrasteAltoLogin = document.createElement('style');
estiloContrasteAltoLogin.innerHTML = `
  .contraste-alto {
    background-color: #000 !important;
    color: #ff0 !important;
  }
  .contraste-alto * {
    background-color: #000 !important;
    color: #ff0 !important;
    border-color: #ff0 !important;
  }
  #botaoContrasteLogin {
    position: fixed;
    top: 10px;
    right: 10px;
    padding: 10px;
    background-color: #000;
    color: #ff0;
    border: 1px solid #ff0;
    border-radius: 5px;
    cursor: pointer;
    z-index: 1000;
  }
  #botaoContrasteLogin:hover {
    background-color: #ff0;
    color: #000;
  }
`;
document.head.appendChild(estiloContrasteAltoLogin);
