const funcionarios = {
  101: { nome: "Luiz", cargo: "Estagiário", setor: "Depósito", carga: 5 },
  102: { nome: "Andrey", cargo: "Estagiário", setor: "Depósito", carga: 5 },
  103: { nome: "Sandoval", cargo: "Estagiário", setor: "Depósito", carga: 5 },
  104: { nome: "Marcelo", cargo: "CLT", setor: "Depósito", carga: 8 },
  105: { nome: "Guilherme", cargo: "Estagiário", setor: "Loja Max", carga: 5 }
};

let registros = [];
try {
  const dadosSalvos = localStorage.getItem("registros");
  registros = dadosSalvos ? JSON.parse(dadosSalvos) : [];
} catch (e) {
  console.error("Erro ao carregar registros", e);
  registros = [];
}

function atualizarHora() {
  const agora = new Date();
  const elementoHora = document.getElementById("horaAtual");
  if (elementoHora) elementoHora.innerText = agora.toLocaleTimeString();
}
setInterval(atualizarHora, 1000);
atualizarHora();

function registrarPonto(tipo) {
  const codigoInput = document.getElementById("codigo");
  const mensagem = document.getElementById("mensagem");
  const codigo = codigoInput ? codigoInput.value : "";

  if (!codigo || !funcionarios[codigo]) {
    if (mensagem) {
      mensagem.innerText = !codigo ? "Digite o código" : "Código não encontrado";
      mensagem.style.color = "orange";
    }
    return;
  }

  const agora = new Date();
  const novoRegistro = {
    codigo: codigo,
    nome: funcionarios[codigo].nome,
    tipo: tipo,
    timestamp: agora.getTime(),
    hora: agora.toLocaleTimeString(),
    data: agora.toLocaleDateString()
  };

  registros.push(novoRegistro);
  localStorage.setItem("registros", JSON.stringify(registros));

  if (mensagem) {
    mensagem.innerText = `${novoRegistro.nome} - ${tipo} registrado!`;
    mensagem.style.color = "lightgreen";
  }

  if (codigoInput) {
    codigoInput.value = "";
    codigoInput.focus();
  }
  renderizarHistorico();
}

function formatarDuracao(ms) {
  const totalMinutos = Math.floor(ms / 60000);
  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;
  return `${String(horas).padStart(2, '0')}h ${String(minutos).padStart(2, '0')}m`;
}

function exportarRelatorio() {
  if (registros.length === 0) return alert("Sem dados para exportar!");
  let csvContent = "\uFEFFData,Nome,Tipo,Hora,Duracao da Sessao\n";

  registros.forEach((reg, index) => {
    let duracao = "";
    if (reg.tipo === "PAUSA" || reg.tipo === "SAÍDA") {
      const logAnterior = registros.slice(0, index).reverse().find(r => r.codigo === reg.codigo);
      if (logAnterior && (logAnterior.tipo === "ENTRADA" || logAnterior.tipo === "RETORNO")) {
        duracao = formatarDuracao(reg.timestamp - logAnterior.timestamp);
      }
    }
    csvContent += `${reg.data},${reg.nome},${reg.tipo},${reg.hora},${duracao}\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", `ponto_deposito_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function renderizarHistorico() {
  const historico = document.getElementById("historico");
  if (!historico) return;
  historico.innerHTML = "";
  
  const ultimosdez = registros.slice(-10).reverse();
  ultimosdez.forEach(r => {
    const div = document.createElement("div");
    div.className = "registro";
    div.innerText = `${r.data || '--'} | ${r.nome || 'Usuário'} | ${r.tipo} | ${r.hora}`;
    historico.appendChild(div);
  });
}

// Inicializa o sistema
document.addEventListener("DOMContentLoaded", () => {
  renderizarHistorico();
});