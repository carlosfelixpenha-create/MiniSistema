// === Protege a página: só permite acesso de usuários logados ===
window.onload = function () {
  // Recupera o usuário logado do localStorage
  const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));

  // Se não estiver logado, redireciona para login
  if (!loggedUser) {
    alert('Acesso restrito! Faça login para continuar.');
    window.location.href = 'login.html';
    return;
  }

  // === Exibe botão de agenda para administradores ===
  if (loggedUser.type === 'Administrador') {
    document.getElementById('adminAgendaBtn').style.display = 'inline-block';

    // Redireciona para a tela de agenda ao clicar
    document.getElementById('adminAgendaBtn').addEventListener('click', () => {
      window.location.href = 'agenda.html'; // ajuste se o nome da tela for diferente
    });
  }

  // === Preenche automaticamente o campo nome com o nome do usuário logado ===
  document.getElementById('nome').value = loggedUser.nome || loggedUser.fullName;
  // Preenche o campo de data com o dia de hoje
  const hoje = new Date().toISOString().split('T')[0];
  document.getElementById('data').value = hoje;

  // === Verifica se o cliente já possui agendamento ===
  const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
  const jaAgendado = agendamentos.some(a => a.email === loggedUser.email);

  // Se já tiver agendamento, exibe mensagem e oculta o formulário
  if (jaAgendado) {
    showMessage('Você já possui um corte agendado. Para alterar, entre em contato com o salão.', 'error');
    document.getElementById('agendamentoForm').style.display = 'none';
  }

  // === Evento de envio do formulário de agendamento ===
  document.getElementById('agendamentoForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Impede o envio padrão do formulário

// Captura os dados preenchidos no formulário
const nome = document.getElementById('nome').value.trim();
const tipoCorte = document.getElementById('tipoCorte').value;
const data = document.getElementById('data').value;
const horario = document.getElementById('horario').value;

// Simula os horários já ocupados no dia
const horariosOcupados = ["10:00", "14:00"];

// Captura o campo select de horários
const selectHorario = document.getElementById('horario');

// Remove da lista os horários ocupados
for (let option of selectHorario.options) {
  if (horariosOcupados.includes(option.value)) {
    option.style.display = 'none'; // esconde o horário ocupado
  }
}

    const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];

    // Verifica novamente se o cliente já tem agendamento (proteção extra)
    if (agendamentos.some(a => a.email === loggedUser.email)) {
      showMessage('Você já possui um corte agendado.', 'error');
      return;
    }

    // Cria o objeto de agendamento e salva no localStorage
    agendamentos.push({ nome, email: loggedUser.email, tipoCorte, data, horario });
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

    // Exibe mensagem de sucesso e oculta o formulário
    showMessage('Agendamento realizado com sucesso!', 'success');
    document.getElementById('agendamentoForm').reset();
    document.getElementById('agendamentoForm').style.display = 'none';
  });
};

// === Função para exibir mensagens temporárias na tela ===
function showMessage(text, type) {
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = text;
  messageDiv.className = `message ${type}`;

  // Limpa a mensagem após 4 segundos
  setTimeout(() => {
    messageDiv.textContent = '';
    messageDiv.className = 'message';
  }, 4000);
}