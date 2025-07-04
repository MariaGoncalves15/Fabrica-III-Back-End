import pool from '../../conexao.js';

export async function cadastrarCliente(dados) {
  const conexao = await pool.getConnection();
  console.log("Dados recebidos para cadastro:", dados);

  try {
    await conexao.beginTransaction();

    // Validação de campos obrigatórios
    if (!dados.nome || !dados.cpf || !dados.senha) {
      throw new Error("Dados obrigatórios ausentes.");
    }

    // Verifica se algum campo de endereço foi enviado
    let enderecoId = null;
    if (dados.endereco && (dados.endereco.cep || dados.endereco.numeroCasa || dados.endereco.complemento)) {
      const [resultadoEndereco] = await conexao.execute(
        `INSERT INTO endereco (cep, numeroCasa, complemento)
         VALUES (?, ?, ?)`,
        [
          dados.endereco.cep ?? null,
          dados.endereco.numeroCasa ?? null,
          dados.endereco.complemento ?? null
        ]
      );
      enderecoId = resultadoEndereco.insertId;
    }

    // Trata telefoneDeEmergencia para aceitar nulo se não informado ou vazio
    const telefoneEmergenciaTratado = dados.telefoneDeEmergencia && dados.telefoneDeEmergencia.trim() !== ''
      ? dados.telefoneDeEmergencia
      : null;

    // Inserção do cliente
    const [resultadoCliente] = await conexao.execute(
      `INSERT INTO clientes (
         nome, cpf, dataDeNascimento,
         email, telefone, telefoneDeEmergencia,
         restricoesMedicas,
         peso, altura, sexo,
         objetivo, fotoPerfil, endereco_idendereco, senha
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        dados.nome ?? null,
        dados.cpf ?? null,
        dados.dataDeNascimento ?? null,
        dados.email ?? null,
        dados.telefone ?? null,
        telefoneEmergenciaTratado,
        dados.restricoesMedicas ?? null,
        dados.peso ?? null,
        dados.altura ?? null,
        dados.sexo ?? null,
        dados.objetivo ?? null,
        dados.fotoPerfil ?? null,
        enderecoId,
        dados.senha ?? null,
      ]
    );

    await conexao.commit();
    console.log("Cliente cadastrado com sucesso.");
    return resultadoCliente;

  } catch (erro) {
    try {
      await conexao.rollback();
    } catch (rollbackErro) {
      console.error("Erro ao tentar rollback:", rollbackErro.message);
    }
    console.error("Erro ao cadastrar cliente:", erro.message);
    throw erro;
  } finally {
    conexao.release();
  }
}
