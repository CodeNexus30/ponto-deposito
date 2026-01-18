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
  const el = document.getElementById("horaAtual");
  if (el) el.innerText = agora.toLocaleTimeString();
}
setInterval(atualizarHora, 1000);
atualizarHora();

function renderizarHistorico() {
  const historico = document.getElementById("historico");
  if (!historico) return;
  historico.innerHTML = "";
  
  const ultimos = registros.slice(-10).reverse();
  ultimos.forEach(r => {
    const div = document.createElement("div");
    div.className = "registro";
    div.innerText = `${r.data} | ${r.nome} | ${r.tipo} | ${r.hora}`;
    historico.appendChild(div);
  });
}

function registrarPonto(tipo) {
  const codigoInput = document.getElementById("codigo");
  const mensagem = document.getElementById("mensagem");
  const codigo = codigoInput ? codigoInput.value : "";

  if (!codigo || !funcionarios[codigo]) {
    if (mensagem) {
      mensagem.innerText = "Código Inválido";
      mensagem.style.color = "red";
    }
    return;
  }

  // --- TRAVA DE SEGURANÇA ---
  // Busca o último registro desta pessoa especifica
  const ultimoPonto = registros.slice().reverse().find(r => r.codigo === codigo);
  
  if (ultimoPonto && ultimoPonto.tipo === tipo) {
    mensagem.innerText = `Erro: Você já registrou ${tipo}!`;
    mensagem.style.color = "orange";
    return;
  }
  // ---------------------------

  const agora = new Date();
  const novo = {
    codigo: codigo,
    nome: funcionarios[codigo].nome,
    tipo: tipo,
    timestamp: agora.getTime(),
    hora: agora.toLocaleTimeString(),
    data: agora.toLocaleDateString()
  };

  registros.push(novo);
  localStorage.setItem("registros", JSON.stringify(registros));

  if (mensagem) {
    mensagem.innerText = `${novo.nome} - ${tipo} OK!`;
    mensagem.style.color = "lightgreen";
  }

  codigoInput.value = "";
  codigoInput.focus();
  renderizarHistorico(); 
}

function exportarRelatorio() {
  if (registros.length === 0) return alert("Sem dados!");
  let csv = "\uFEFFData,Nome,Tipo,Hora,Duracao\n";
  registros.forEach((reg, i) => {
    let duracao = "";
    if (reg.tipo === "PAUSA" || reg.tipo === "SAÍDA") {
      const anterior = registros.slice(0, i).reverse().find(r => r.codigo === reg.codigo);
      if (anterior && (anterior.tipo === "ENTRADA" || anterior.tipo === "RETORNO")) {
        const diff = reg.timestamp - anterior.timestamp;
        const totalMin = Math.floor(diff / 60000);
        duracao = `${Math.floor(totalMin/60)}h ${totalMin%60}m`;
      }
    }
    csv += `${reg.data},${reg.nome},${reg.tipo},${reg.hora},${duracao}\n`;
  });
  const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "ponto.csv";
  link.click();
}

renderizarHistorico();