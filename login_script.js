// Selecionar os elementos principais da tela de login
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const togglePasswordButton = document.getElementById('togglePassword');
const errorMessageDiv = document.getElementById('error-message');

// Criação do botão de acessibilidade
const botaoAcessibilidadeLogin = document.createElement('button');
botaoAcessibilidadeLogin.id = 'botaoContrasteLogin';
botaoAcessibilidadeLogin.textContent = 'Ativar Contraste Alto';
botaoAcessibilidadeLogin.classList.add('acessibilidade-botao');
document.body.appendChild(botaoAcessibilidadeLogin);

// Função para ativar/desativar o modo de contraste alto
botaoAcessibilidadeLogin.addEventListener('click', () => {
    const body = document.body;
    const contrasteAtivo = body.classList.toggle('contraste-alto');
    botaoAcessibilidadeLogin.textContent = contrasteAtivo ? 'Desativar Contraste Alto' : 'Ativar Contraste Alto';
});

// Estilos para o modo de contraste alto e botão de acessibilidade
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
  .contraste-alto input[type="text"],
  .contraste-alto input[type="password"],
  .contraste-alto button {
    border: 1px solid #ff0 !important;
  }
  .contraste-alto body {
    background: #000 !important;
    background-image: none !important;
  }
  .contraste-alto {
    background: #000 !important;
    background-image: none !important;
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
