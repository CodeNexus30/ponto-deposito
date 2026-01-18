const funcionarios = {
  101: { nome: "Luiz", cargo: "Estagiário", setor: "Depósito", carga: 5 },
  102: { nome: "Andrey", cargo: "Estagiário", setor: "Depósito", carga: 5 },
  103: { nome: "Sandoval", cargo: "Estagiário", setor: "Depósito", carga: 5 },
  104: { nome: "Marcelo", cargo: "CLT", setor: "Depósito", carga: 8 },
  105: { nome: "Guilherme", cargo: "Estagiário", setor: "Loja Max", carga: 5 }
};

let registros = JSON.parse(localStorage.getItem("registros")) || [];

function atualizarHora() {
  const agora = new Date();
  document.getElementById("horaAtual").innerText = agora.toLocaleTimeString();
}
setInterval(atualizarHora, 1000);
atualizarHora();

function registrarPonto(tipo) {
  const codigoInput = document.getElementById("codigo");
  const mensagem = document.getElementById("mensagem");
  const codigo = codigoInput.value;

  if (!codigo || !funcionarios[codigo]) {
    mensagem.innerText = !codigo ? "Digite o código" : "Código não encontrado";
    mensagem.style.color = "red";
    return;
  }

  const agora = new Date();
  const registro = {
    codigo: codigo,
    nome: funcionarios[codigo].nome,
    tipo: tipo,
    timestamp: agora.getTime(),
    hora: agora.toLocaleTimeString(),
    data: agora.toLocaleDateString()
  };

  registros.push(registro);
  localStorage.setItem("registros", JSON.stringify(registros));

  mensagem.innerText = `${registro.nome} - ${tipo} às ${registro.hora}`;
  mensagem.style.color = "lightgreen";

  codigoInput.value = "";
  codigoInput.focus();
  renderizarHistorico();
}

function formatarDuracao(ms) {
  const totalMinutos = Math.floor(ms / 60000);
  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;
  return `${String(horas).padStart(2, '0')}h ${String(minutos).padStart(2, '0')}m`;
}

function exportarRelatorio() {
  if (registros.length === 0) return alert("Sem dados!");
  let csvContent = "data:text/csv;charset=utf-8,Data,Nome,Tipo,Hora,Duracao da Sessao\n";

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

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `ponto_${new Date().toLocaleDateString()}.csv`);
  document.body.appendChild(link);
  link.click();
}

function renderizarHistorico() {
  const historico = document.getElementById("historico");
  if (!historico) return;
  historico.innerHTML = "";
  registros.slice().reverse().forEach(r => {
    const div = document.createElement("div");
    div.className = "registro";
    div.innerText = `${r.data || '--'} | ${r.nome} | ${r.tipo} | ${r.hora}`;
    historico.appendChild(div);
  });
}
renderizarHistorico();