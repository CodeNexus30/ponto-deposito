const funcionarios = {
  101: { nome: "Luiz", cargo: "Estagiário", setor: "Depósito" },
  102: { nome: "Andrey", cargo: "Estagiário", setor: "Depósito" },
  103: { nome: "Sandoval", cargo: "Estagiário", setor: "Depósito" },
  104: { nome: "Marcelo", cargo: "CLT", setor: "Depósito" },
  105: { nome: "Guilherme", cargo: "Estagiário", setor: "Loja Max" },
  106: { nome: "Kauan", cargo: "Estagiário", setor: "Loja Max" }
};

// Carrega registros ou inicia array vazio
let registros = JSON.parse(localStorage.getItem("registros")) || [];

function atualizarRelogio() {
  const agora = new Date();
  
  // Hora
  document.getElementById("horaAtual").innerText = agora.toLocaleTimeString('pt-BR');
  
  // Data
  const opcoesData = { weekday: 'short', day: 'numeric', month: 'short' };
  document.getElementById("dataAtual").innerText = agora.toLocaleDateString('pt-BR', opcoesData);
}

setInterval(atualizarRelogio, 1000);
atualizarRelogio();

function registrarPonto(tipo) {
  const codigoInput = document.getElementById("codigo");
  const feedback = document.getElementById("feedback");
  const codigo = codigoInput.value;

  feedback.style.opacity = 1;

  // Validação 1: Código vazio
  if (!codigo) {
    mostrarFeedback("Digite seu código!", "yellow");
    return;
  }

  // Validação 2: Funcionário não existe
  if (!funcionarios[codigo]) {
    mostrarFeedback("Código inválido!", "red");
    codigoInput.value = "";
    codigoInput.focus();
    return;
  }

  const funcionario = funcionarios[codigo];
  const agora = new Date();

  const novoRegistro = {
    id: Date.now(), // ID único para o registro
    codigo: codigo,
    nome: funcionario.nome,
    cargo: funcionario.cargo,
    tipo: tipo,
    timestamp: agora.toISOString(), // Salva data completa (ISO) para o banco/excel
    dataLegivel: agora.toLocaleDateString('pt-BR'),
    horaLegivel: agora.toLocaleTimeString('pt-BR')
  };

  registros.push(novoRegistro);
  localStorage.setItem("registros", JSON.stringify(registros));

  mostrarFeedback(`${funcionario.nome}: ${tipo} registrado!`, "#22c55e"); // Verde sucesso
  
  codigoInput.value = "";
  codigoInput.focus();
  renderizarHistorico();
  
  // Limpa feedback após 3 segundos
  setTimeout(() => {
    feedback.innerText = "";
  }, 3000);
}

function mostrarFeedback(texto, cor) {
  const feedback = document.getElementById("feedback");
  feedback.innerText = texto;
  feedback.style.color = cor;
}

function renderizarHistorico() {
  const historicoDiv = document.getElementById("historico");
  historicoDiv.innerHTML = "";

  // Pega os últimos 20 registros e inverte a ordem (mais novo primeiro)
  const ultimosRegistros = registros.slice(-20).reverse();

  ultimosRegistros.forEach(reg => {
    const div = document.createElement("div");
    div.className = `registro-item tipo-${reg.tipo.toLowerCase()}`;
    
    // Ícone baseado no tipo
    let icone = "";
    if(reg.tipo === 'ENTRADA') icone = "ph-sign-in";
    if(reg.tipo === 'PAUSA') icone = "ph-coffee";
    if(reg.tipo === 'RETORNO') icone = "ph-arrow-u-up-left";
    if(reg.tipo === 'SAÍDA') icone = "ph-sign-out";

    div.innerHTML = `
      <div class="reg-info">
        <span class="reg-nome">${reg.nome}</span>
        <span class="reg-cargo">${reg.dataLegivel} • ${reg.tipo}</span>
      </div>
      <div class="reg-hora">${reg.horaLegivel}</div>
    `;
    
    historicoDiv.appendChild(div);
  });
}

// Função Poderosa: Exportar para Excel (CSV)
function exportarRelatorio() {
  if (registros.length === 0) {
    alert("Sem registros para exportar.");
    return;
  }

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Data,Hora,Nome,Cargo,Tipo,Codigo\n"; // Cabeçalho

  registros.forEach(row => {
    const linha = `${row.dataLegivel},${row.horaLegivel},${row.nome},${row.cargo},${row.tipo},${row.codigo}`;
    csvContent += linha + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "ponto_deposito.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Inicializa
renderizarHistorico();