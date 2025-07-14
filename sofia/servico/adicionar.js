import pool from "../../../conexao.js";

export async function cadastrarCliente(dados) {
  const conexao = await pool.getConnection();
  console.log("Dados recebidos para cadastro:", dados);

  try {
    console.log("Iniciando transação...");
    await conexao.beginTransaction();

    // ✅ Validação de campos obrigatórios
    if (!dados.nome || !dados.cpf || !dados.senha) {
      console.error(" Dados obrigatórios ausentes:", {
        nome: dados.nome,
        cpf: dados.cpf,
        senha: dados.senha
      });
      throw new Error("Dados obrigatórios ausentes.");
    }

    // ✅ Inserção do endereço (se houver)
    let enderecoId = null;
    if (dados.endereco && (dados.endereco.cep || dados.endereco.numeroCasa || dados.endereco.complemento)) {
      console.log("Inserindo endereço...");
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
      console.log("Endereço inserido com ID:", enderecoId);
    }

    // ✅ Tratar telefone de emergência
    const telefoneEmergenciaTratado = dados.telefoneDeEmergencia && dados.telefoneDeEmergencia.trim() !== ''
      ? dados.telefoneDeEmergencia
      : null;

    // ✅ Inserção do cliente
    console.log("Inserindo cliente...");
    const [resultadoCliente] = await conexao.execute(
      `INSERT INTO clientes (
         nome, cpf, dataDeNascimento,
         email, telefone, telefoneDeEmergencia,
         restricoesMedicas,
         peso, altura, sexo,
         objetivo, fotoPerfil, endereco_idendereco, senha
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        dados.nome,
        dados.cpf,
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
        dados.senha
      ]
    );

    console.log("Cliente inserido com ID:", resultadoCliente.insertId);

    // ✅ Commit da transação
    await conexao.commit();
    console.log("Commit realizado com sucesso.");

    // ✅ Buscar e retornar cliente inserido
    const [clienteInserido] = await conexao.execute(
      `SELECT idcliente, nome, cpf, dataDeNascimento, email 
       FROM clientes 
       WHERE idcliente = ?`,
      [resultadoCliente.insertId]
    );

    console.log("Cliente cadastrado com sucesso:", clienteInserido[0]);
    return clienteInserido[0];

  } catch (erro) {
    try {
      console.warn("⚠️ Erro detectado. Executando rollback...");
      await conexao.rollback();
    } catch (rollbackErro) {
      console.error("Erro ao tentar rollback:", rollbackErro.message);
    }
    console.error("Erro ao cadastrar cliente:", erro);
    throw erro;
  } finally {
    conexao.release();
    console.log("Conexão liberada.");
  }
}
