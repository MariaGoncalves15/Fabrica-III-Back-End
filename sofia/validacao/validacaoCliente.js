function dataValida(dataStr) {
  const data = new Date(dataStr);
  return !isNaN(data.getTime()) && dataStr.length >= 8;
}

export function validarCliente(dados) {
  console.log("Validando telefoneDeEmergencia:", dados.telefoneDeEmergencia);
  const erros = [];

  if (!dados.nome || dados.nome.trim().length < 3) {
    erros.push("Nome é obrigatório e deve ter no mínimo 3 letras.");
  }

  if (!dados.senha || dados.senha.length < 6) {
    erros.push("Senha é obrigatória e deve ter no mínimo 6 caracteres.");
  }

  if (!dados.cpf || dados.cpf.length !== 11) {
    erros.push("CPF é obrigatório e deve ter exatamente 11 dígitos.");
  }

  if (!dados.dataDeNascimento) {
    erros.push("Data de nascimento é obrigatória.");
  } else if (!dataValida(dados.dataDeNascimento)) {
    erros.push("Data de nascimento inválida.");
  }

  if (!dados.email || !dados.email.includes("@")) {
    erros.push("Email é obrigatório e deve ser válido.");
  }

  if (!dados.telefone) {
    erros.push("Telefone é obrigatório.");
  }

  if (!dados.telefoneDeEmergencia) {
  erros.push("Telefone de emergência é obrigatório.");
  }

  if (!dados.restricoesMedicas || dados.restricoesMedicas.trim().length === 0) {
    erros.push("Restrições médicas são obrigatórias. Caso não tenha, escreva 'Nenhuma'.");
  }

  return erros;
}

export function validarAtualizacaoCliente(dados = {}) {
  const erros = [];

  if (dados.nome && dados.nome.trim().length < 3) {
    erros.push("Nome deve ter no mínimo 3 letras.");
  }

  if (dados.senha && dados.senha.length < 6) {
    erros.push("Senha deve ter no mínimo 6 caracteres.");
  }

  if (dados.cpf && dados.cpf.length !== 11) {
    erros.push("CPF deve ter exatamente 11 dígitos.");
  }

  if (dados.dataDeNascimento && !dataValida(dados.dataDeNascimento)) {
    erros.push("Data de nascimento inválida.");
  }

  if (dados.email && !dados.email.includes("@")) {
    erros.push("Email deve ser válido.");
  }

  if (!dados.telefoneDeEmergencia) {
    erros.push("Telefone de emergência é obrigatório.");
  }

  if (!dados.restricoesMedicas) {
    erros.push("Restrições médicas são obrigatórias. Caso não tenha, escreva 'Nenhuma'.");
  }

  return erros;
}
