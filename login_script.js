// login_script.js

// Elementos do formulário
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const togglePasswordButton = document.getElementById('togglePassword');
const errorMessageDiv = document.getElementById('error-message');

// Função para alternar a visibilidade da senha
togglePasswordButton.addEventListener('click', () => {
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
  togglePasswordButton.textContent = type === 'password' ? 'Mostrar' : 'Ocultar';
  console.log('Senha visível:', type === 'text');
});

// Evento de envio do formulário
loginForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Evita o envio padrão do formulário

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  console.log('Tentativa de login com usuário:', username);

  if (!username || !password) {
    errorMessageDiv.textContent = 'Por favor, preencha todos os campos.';
    console.log('Erro: Campos obrigatórios não preenchidos');
    return;
  }

  // Simulação de validação (exemplo simples)
  if (username === 'admin' && password === '123456781') {
    console.log('Login bem-sucedido');
    errorMessageDiv.textContent = '';
    // Redirecionar para a página index.html após login bem-sucedido
    window.location.href = 'index.html';
  } else {
    errorMessageDiv.textContent = 'Usuário ou senha incorretos.';
    console.log('Erro: Credenciais inválidas');
  }
});
