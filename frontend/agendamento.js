// Protege a página: só permite acesso de clientes
window.onload = function () {
  const user = JSON.parse(localStorage.getItem('loggedUser'));

  // Se não estiver logado ou não for cliente, redireciona
  if (!user || user.type !== 'Cliente') {
    alert('Acesso restrito!');
    window.location.href = 'login.html';
    return;
  }

  // Preenche o campo nome automaticamente com o nome do usuário logado
  document.getElementById('nome').value = user.nome || user.fullName;

  // Verifica se o cliente já possui agendamento
  const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
  const jaAgendado = agendamentos.some(a => a.email === user.email);

  // Se já tiver agendamento, exibe mensagem e oculta o formulário
  if (jaAgendado) {
    showMessage('Você já possui um corte agendado. Para alterar, entre em contato com o salão.', 'error');
    document.getElementById('agendamentoForm').style.display = 'none';
  }
};

// Evento de envio do formulário de agendamento
document.getElementById('agendamentoForm').addEventListener('submit', function (e) {
  e.preventDefault(); // Impede o envio padrão do formulário

  const user = JSON.parse(localStorage.getItem('loggedUser'));

  // Captura os dados preenchidos no formulário
  const nome = document.getElementById('nome').value.trim();
  const tipoCorte = document.getElementById('tipoCorte').value;
  const data = document.getElementById('data').value;
  const horario = document.getElementById('horario').value;

  const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];

  // Verifica novamente se o cliente já tem agendamento (proteção extra)
  if (agendamentos.some(a => a.email === user.email)) {
    showMessage('Você já possui um corte agendado.', 'error');
    return;
  }

  // Cria o objeto de agendamento e salva no localStorage
  agendamentos.push({ nome, email: user.email, tipoCorte, data, horario });
  localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

  // Exibe mensagem de sucesso e oculta o formulário
  showMessage('Agendamento realizado com sucesso!', 'success');
  document.getElementById('agendamentoForm').reset();
  document.getElementById('agendamentoForm').style.display = 'none';
});

// Função para exibir mensagens temporárias
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