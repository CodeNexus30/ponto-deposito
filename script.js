const funcionarios = {
  101: { nome: "Luiz", cargo: "Estagiário", setor: "Depósito", carga: 5 },
  102: { nome: "Andrey", cargo: "Estagiário", setor: "Depósito", carga: 5 },
  103: { nome: "Sandoval", cargo: "Estagiário", setor: "Depósito", carga: 5 },
  104: { nome: "Marcelo", cargo: "CLT", setor: "Depósito", carga: 8 },
  105: { nome: "Guilherme", cargo: "Estagiário", setor: "Loja Max", carga: 5 },
  106: { nome: "Kauan", cargo: "Estagiário", setor: "Loja Max", carga: 5 }
};

let registros = JSON.parse(localStorage.getItem("registros")) || [];

function atualizarHora() {
  const agora = new Date();
  document.getElementById("horaAtual").innerText =
    agora.toLocaleTimeString();
}

setInterval(atualizarHora, 1000);
atualizarHora();

function registrarPonto(tipo) {
  const codigoInput = document.getElementById("codigo");
  const mensagem = document.getElementById("mensagem");
  const codigo = codigoInput.value;

  if (!codigo) {
    mensagem.innerText = "Digite o código";
    mensagem.style.color = "yellow";
    return;
  }

  if (!funcionarios[codigo]) {
    mensagem.innerText = "Código não encontrado";
    mensagem.style.color = "red";
    return;
  }

  const agora = new Date();

  const registro = {
    codigo: codigo,
    nome: funcionarios[codigo].nome,
    tipo: tipo,
    hora: agora.toLocaleTimeString()
  };

  registros.push(registro);
  localStorage.setItem("registros", JSON.stringify(registros));

  mensagem.innerText = `${registro.nome} - ${tipo} às ${registro.hora}`;
  mensagem.style.color = "lightgreen";

  codigoInput.value = "";
  codigoInput.focus();

  renderizarHistorico();
}

function renderizarHistorico() {
  const historico = document.getElementById("historico");
  historico.innerHTML = "";

  registros.slice().reverse().forEach(r => {
    const div = document.createElement("div");
    div.className = "registro";
    div.innerText = `${r.nome} | ${r.tipo} | ${r.hora}`;
    historico.appendChild(div);
  });
}

renderizarHistorico();
