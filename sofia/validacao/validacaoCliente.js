function dataValida(dataStr) {
  const data = new Date(dataStr);
  return !isNaN(data.getTime()) && dataStr.length >= 8;
}

export function validarCliente(dados) {
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

  if (!dados.endereco?.cep) {
    erros.push("CEP é obrigatório.");
  }

  if (!dados.endereco?.numeroCasa) {
    erros.push("Número da casa é obrigatório.");
  }

  if (!dados.formacao?.formacao) {
    erros.push("Formação é obrigatória.");
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

  if (dados.telefone && typeof dados.telefone !== 'string') {
    erros.push("Telefone deve ser uma string.");
  }

  if (dados.endereco?.cep && typeof dados.endereco.cep !== 'string') {
    erros.push("CEP deve ser uma string.");
  }

  if (dados.endereco?.numeroCasa && typeof dados.endereco.numeroCasa !== 'string') {
    erros.push("Número da casa deve ser uma string.");
  }

  if (dados.formacao?.formacao && typeof dados.formacao.formacao !== 'string') {
    erros.push("Formação deve ser uma string.");
  }

  return erros;
}