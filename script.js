// script.js - Código atualizado para implementar o botão de acessibilidade com contraste preto e amarelo aplicado em todo o site

// Variáveis Globais
let dadosSelecionados = []; // Array para armazenar os dados selecionados
const listaDadosSelecionados = document.getElementById("listaDadosSelecionados");
const resultadoTotal = document.getElementById("resultadoTotal");
const detalhesRolagem = document.getElementById("detalhesRolagem");
const historicoLista = document.getElementById("historicoLista");

// Modificadores
let modificador = 0;
const inputModificador = document.getElementById("inputModificador");

// Função para atualizar o valor do modificador
function atualizarModificador(valor) {
    modificador = Math.max(-10, Math.min(10, modificador + valor));
    inputModificador.value = modificador;
    console.log("Modificador atualizado:", modificador);
}

// Atualiza o valor do modificador ao digitar diretamente
inputModificador.addEventListener('input', () => {
    modificador = parseInt(inputModificador.value) || 0;
    console.log("Valor do modificador digitado:", modificador);
});

// Funções para aumentar e diminuir o modificador
document.getElementById("aumentarMod").addEventListener('click', () => {
    atualizarModificador(1);
});

document.getElementById("diminuirMod").addEventListener('click', () => {
    atualizarModificador(-1);
});

// Delegar evento de clique ao container dos dados
const diceContainer = document.querySelector('.dice-container');
if (diceContainer) {
    diceContainer.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('dado')) {
            const tipoDado = parseInt(e.target.getAttribute('data-dado'));
            
            if (isNaN(tipoDado)) {
                console.error('Atributo data-dado não encontrado ou inválido');
                return;
            }

            console.log("Tipo de dado selecionado:", tipoDado);

            // Verifica se o dado já foi selecionado
            const dadoExistente = dadosSelecionados.find(d => d.tipo === tipoDado);
            if (dadoExistente) {
                dadoExistente.quantidade += 1; // Se já existe, aumenta a quantidade
            } else {
                dadosSelecionados.push({ tipo: tipoDado, quantidade: 1 }); // Se não existe, adiciona um novo
            }

            // Atualiza a exibição da lista de dados selecionados
            atualizarListaDadosSelecionados();
            document.getElementById('rolarDado').disabled = false;
        }
    });
} else {
    console.error("Container de dados '.dice-container' não encontrado.");
}

// Função para atualizar a lista de dados selecionados
function atualizarListaDadosSelecionados() {
    console.log("Atualizando lista de dados selecionados:", dadosSelecionados);
    // Usando DocumentFragment para reduzir reflows e melhorar a performance
    const fragment = document.createDocumentFragment(); // Usa DocumentFragment para melhorar a performance ao manipular múltiplos elementos do DOM
    for (let i = 0; i < dadosSelecionados.length; i++) {
        const dado = dadosSelecionados[i];
        const dadoCard = document.createElement('div');
        dadoCard.classList.add('dado-card');
        dadoCard.style.padding = '5px';
        dadoCard.style.marginBottom = '5px';

        const dadoInfo = document.createElement('span');
        dadoInfo.textContent = `${dado.quantidade}D${dado.tipo}`;

        const removerDadoBtn = document.createElement('button');
        removerDadoBtn.textContent = '✖';
        removerDadoBtn.addEventListener('click', () => {
            removerUmDado(dado.tipo);
        });

        dadoCard.appendChild(dadoInfo);
        dadoCard.appendChild(removerDadoBtn);
        fragment.appendChild(dadoCard);
    }
    while (listaDadosSelecionados.firstChild) {
        listaDadosSelecionados.removeChild(listaDadosSelecionados.firstChild);
    } // Limpa a lista atual
    listaDadosSelecionados.appendChild(fragment); // Adiciona o conteúdo do fragmento
}

// Função para remover UM dado de um tipo
function removerUmDado(tipoDado) {
    console.log("Removendo um dado do tipo:", tipoDado);
    const index = dadosSelecionados.findIndex(d => d.tipo === tipoDado);
    if (index !== -1) {
        if (dadosSelecionados[index].quantidade > 1) {
            dadosSelecionados[index].quantidade -= 1; // Diminui a quantidade
        } else {
            dadosSelecionados.splice(index, 1); // Remove completamente se for o último
        }
    }
    atualizarListaDadosSelecionados(); // Atualiza a interface
    if (dadosSelecionados.length === 0) {
        document.getElementById('rolarDado').disabled = true;
    }
}

// Evento do botão de rolar dados
const debouncedRolarDados = debounce(() => {
    document.getElementById('rolarDado').disabled = true;
    rolarDados();
    const timeoutDuration = 1000;
    setTimeout(() => {
        document.getElementById('rolarDado').disabled = false;
    }, timeoutDuration);
}, 300);

document.getElementById('rolarDado').addEventListener('click', debouncedRolarDados);

// Função debounce
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Função para rolar os dados selecionados
function rolarDados() {
    console.log("Iniciando rolagem dos dados:", dadosSelecionados);
    if (dadosSelecionados.length > 0) {
        let resultadoSoma = 0;
        let detalhes = '';

        // Rola cada tipo de dado a quantidade de vezes selecionada
        dadosSelecionados.forEach(dado => {
            for (let i = 0; i < dado.quantidade; i++) {
                const resultado = rolarDado(dado.tipo);
                resultadoSoma += resultado;
                detalhes += `D${dado.tipo}: ${resultado} `;
            }
        });

        // Adiciona o modificador
        resultadoSoma += modificador;
        detalhes += `+ Modificador: ${modificador}`;

        // Exibe o resultado
        resultadoTotal.textContent = `Total: ${resultadoSoma}`;
        detalhesRolagem.textContent = detalhes;
        document.getElementById('resultado').classList.add('mostrar');

        console.log("Resultado da rolagem:", resultadoSoma, "Detalhes:", detalhes);

        // Adicionar ao histórico
        adicionarAoHistorico(detalhes, resultadoSoma);
    } else {
        alert('Por favor, selecione ao menos um dado.');
    }
}

// Função que rola o dado
function rolarDado(lados) {
    const resultado = Math.floor(Math.random() * lados) + 1;
    console.log("Resultado do dado de", lados, "lados:", resultado);
    return resultado;
}

// Adicionar ao histórico de rolagens
function adicionarAoHistorico(detalhes, resultado) {
    console.log("Adicionando ao histórico. Detalhes:", detalhes, "Resultado:", resultado);
    const historicoItem = document.createElement('div');
    historicoItem.classList.add('historico-item');
    historicoItem.style.padding = '10px';
    historicoItem.style.marginBottom = '10px';

    const timestamp1 = new Date(); // Gera a data atual
    const dataFormatada = timestamp1.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    historicoItem.setAttribute('data-date', dataFormatada);

    const timestamp = new Date().toLocaleString();
    const timestampDiv = document.createElement('div');
    timestampDiv.classList.add('timestamp');
    timestampDiv.innerHTML = `<em>${timestamp}</em>`;
    timestampDiv.style.marginBottom = "10px";
    timestampDiv.style.fontSize = "0.9rem";

    const detalhesDiv = document.createElement('div');
    detalhesDiv.classList.add('detalhes');
    detalhesDiv.innerHTML = `<strong>Detalhes:</strong> ${detalhes}`;
    detalhesDiv.style.marginBottom = "10px";

    const totalDiv = document.createElement('div');
    totalDiv.classList.add('total');
    totalDiv.innerHTML = `<strong>Total:</strong> ${resultado}`;
    totalDiv.style.fontSize = "1.2rem";
    totalDiv.style.fontWeight = "bold";

    historicoItem.appendChild(timestampDiv);
    historicoItem.appendChild(detalhesDiv);
    historicoItem.appendChild(totalDiv);
    historicoLista.prepend(historicoItem); // Adiciona ao início do histórico
    const item = { detalhes, resultado, timestamp };

    // Salvar no localStorage
    let historico = JSON.parse(localStorage.getItem("historicoRolagens")) || [];
    historico.push(item);
    localStorage.setItem("historicoRolagens", JSON.stringify(historico));

}

// Limpar seleção de dados
document.getElementById('limparDados').addEventListener('click', () => {
    dadosSelecionados = []; // Limpa a seleção de dados
    atualizarListaDadosSelecionados(); // Atualiza a interface
    document.getElementById('rolarDado').disabled = true;
});

// Botões de rolagem do histórico
document.getElementById('scrollTop').addEventListener('click', () => {
    historicoLista.scrollTop = 0;
});

document.getElementById('scrollBottom').addEventListener('click', () => {
    historicoLista.scrollTop = historicoLista.scrollHeight;
});

// Código JavaScript para implementar um botão de acessibilidade que altera o contraste para preto e amarelo baseado no projeto existente

// Criação do botão de acessibilidade
const botaoAcessibilidade = document.createElement('button');
botaoAcessibilidade.id = 'botaoContraste';
botaoAcessibilidade.textContent = 'Ativar Contraste Alto';
botaoAcessibilidade.classList.add('acessibilidade-botao');
document.body.appendChild(botaoAcessibilidade);

// Função para ativar/desativar o modo de contraste alto
botaoAcessibilidade.addEventListener('click', () => {
    const body = document.body;
    const contrasteAtivo = body.classList.toggle('contraste-alto');
    botaoAcessibilidade.textContent = contrasteAtivo ? 'Desativar Contraste Alto' : 'Ativar Contraste Alto';
});

// Estilos para o modo de contraste alto e botão de acessibilidade
const estiloContrasteAlto = document.createElement('style');
estiloContrasteAlto.innerHTML = `
  .contraste-alto {
    background-color: #000 !important;
    color: #ff0 !important;
    scrollbar-width: thin !important;
    scrollbar-color: #ff0 #000 !important;
  }
  .contraste-alto * {
    background-color: #000 !important;
    color: #ff0 !important;
    border-color: #ff0 !important;
    scrollbar-width: thin !important;
    scrollbar-color: #ff0 #000 !important;
  }
  .contraste-alto .total {
    color: #ff0 !important;
  }

  .contraste-alto body {
    background: #000 !important;
    background-image: none !important;
    scrollbar-width: thin !important;
    scrollbar-color: #ff0 #000 !important;
  }

  .contraste-alto .historico-item {
    border-color: #ff0 !important;
    scrollbar-width: thin!important ;
    scrollbar-color: #ff0 #000 !important;
  }

  .contraste-alto .historicolista {
    border-color: #ff0 !important;
    scrollbar-width: thin !important; 
    scrollbar-color: #ff0 #000 !important ;
  }

  .contraste-alto button {
    border: 1px solid #ff0 !important;
  }

  .contraste-alto {
    background: #000 !important;
    background-image: none !important;
  }

  #botaoContraste {
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
  #botaoContraste:hover {
    background-color: #ff0;
    color: #000;
  }
`;
document.head.appendChild(estiloContrasteAlto);

// Seleciona todos os botões com o atributo 'data-tooltip'
document.querySelectorAll('[data-tooltip]').forEach((button) => {
    // Cria o elemento da tooltip
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.textContent = button.getAttribute('data-tooltip');
    document.body.appendChild(tooltip);

    // Eventos de mouse para exibir a tooltip
    button.addEventListener('mouseenter', (e) => {
        const rect = button.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX + rect.width / 2 - tooltip.offsetWidth / 2}px`;
        tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 5}px`;
        tooltip.classList.add('show');
    });

    // Oculta a tooltip ao sair do botão
    button.addEventListener('mouseleave', () => {
        tooltip.classList.remove('show');
    });
});

// Função para apagar o histórico de rolagens
// Função para apagar o histórico de rolagens
function apagarHistorico() {
    // Limpa o localStorage
    localStorage.removeItem("historicoRolagens");

    // Limpa o histórico da interface
    const historicoLista = document.getElementById("historicoLista");
    historicoLista.innerHTML = "";

    alert("Histórico apagado com sucesso!");
}


// Função para alternar a visibilidade da aba de usuário
function toggleAbaUsuario() {
    const abaUsuario = document.getElementById("abaUsuario");
    abaUsuario.classList.toggle("mostrar");
}

// Função para editar o perfil
function editarPerfil() {
    const nomeUsuario = prompt("Digite o seu nome:", "Visitante");
    if (nomeUsuario) {
        document.getElementById("nomeUsuario").textContent = nomeUsuario;
        console.log("Nome de usuário atualizado para:", nomeUsuario);
    }
}

function logout() {
    // Limpa as informações do usuário armazenadas localmente (se houver)
    localStorage.removeItem('currentUser'); // Exemplo de dado de sessão
    alert('Você saiu com sucesso!');
    
    // Redireciona para a página de login
    window.location.href = 'login.html'; // Substitua 'login.html' pelo nome real da sua página de login
}


function aplicarFiltroPorData() {
    const filtroData = document.getElementById("filtroData").value; // Data escolhida no input
    if (!filtroData) {
        alert("Por favor, selecione uma data."); // Alerta caso não tenha data
        return;
    }

    // Seleciona todos os itens do histórico
    const historicoItems = document.querySelectorAll(".historico-item");

    // Filtra os itens com base na data
    historicoItems.forEach(item => {
        const itemDate = item.getAttribute("data-date"); // Data atribuída ao item no histórico
        if (itemDate === filtroData) {
            item.style.display = "block"; // Exibe itens que correspondem
        } else {
            item.style.display = "none"; // Oculta os demais
        }
    });
}

function limparFiltro() {
    const historicoItems = document.querySelectorAll(".historico-item");
    historicoItems.forEach(item => {
        item.style.display = "block"; // Exibe todos os itens
    });
    document.getElementById("filtroData").value = ""; // Limpa o campo de data
}

function baixarDados() {
    const historicoItems = document.querySelectorAll(".historico-item");
    if (historicoItems.length === 0) {
        alert("Não há dados no histórico para baixar.");
        return;
    }

    // Cria um array com os dados do histórico
    const dados = Array.from(historicoItems).map(item => {
        const data = item.getAttribute("data-date");
        const detalhes = item.querySelector(".detalhes").textContent;
        const total = item.querySelector(".total").textContent;
        return { data, detalhes, total };
    });

    // Converte os dados para JSON
    const dadosJSON = JSON.stringify(dados, null, 2);

    // Cria um blob e uma URL para download
    const blob = new Blob([dadosJSON], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Cria um link para download
    const link = document.createElement("a");
    link.href = url;
    link.download = "historico_rolagens.json";
    link.click();

    // Libera a URL do blob
    URL.revokeObjectURL(url);
}

function abrirAjuda() {
    const modal = document.getElementById("modalAjuda");
    modal.style.display = "block";
    modal.setAttribute("aria-hidden", "false");

    // Foca no primeiro elemento interativo dentro do modal
    modal.querySelector("button").focus();
}

function fecharAjuda() {
    const modal = document.getElementById("modalAjuda");
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");

    // Retorna o foco ao botão de ajuda
    document.getElementById("ajudaBtn").focus();
}

// Fecha o modal ao pressionar "ESC"
window.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        fecharAjuda();
    }
});

// Fecha o modal ao clicar fora do conteúdo
window.onclick = function (event) {
    const modal = document.getElementById("modalAjuda");
    if (event.target === modal) {
        fecharAjuda();
    }
};


// Restaurar o histórico ao carregar a página
function exibirHistorico() {
    const historicoLista = document.getElementById("historicoLista");
    historicoLista.innerHTML = ""; // Limpa a lista atual

    const historico = JSON.parse(localStorage.getItem("historicoRolagens")) || [];
    historico.forEach(item => {
        const historicoItem = document.createElement('div');
        historicoItem.classList.add('historico-item');
        historicoItem.innerHTML = `
            <div><em>${item.timestamp}</em></div>
            <div><strong>Detalhes:</strong> ${item.detalhes}</div>
            <div><strong>Total:</strong> ${item.resultado}</div>
        `;
        historicoLista.prepend(historicoItem); // Adiciona ao início
    });
}

// Chamar a função ao carregar a página
document.addEventListener("DOMContentLoaded", exibirHistorico);