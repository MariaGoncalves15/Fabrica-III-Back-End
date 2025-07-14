import pool from '../../conexao.js';

export async function cadastrarCliente(dados) {
  console.log("Dados recebidos para cadastro:", dados);
  const conexao = await pool.getConnection();

  try {
    await conexao.beginTransaction();

    // 1. Inserir ENDEREÇO (se existir dados)
    let enderecoId = null;
    if (dados.endereco && (dados.endereco.cep || dados.endereco.numeroCasa || dados.endereco.complemento)) {
      const [resultadoEndereco] = await conexao.execute(
        `INSERT INTO endereco (cep, numeroCasa, complemento) VALUES (?, ?, ?)`,
        [
          dados.endereco.cep || null,
          dados.endereco.numeroCasa || null,
          dados.endereco.complemento || null
        ]
      );
      enderecoId = resultadoEndereco.insertId;
    }

    // 2. Inserir CLIENTE
    const [resultadoCliente] = await conexao.execute(
      `INSERT INTO clientes (
        nome, senha, cpf, dataDeNascimento, email, telefone,
        telefoneDeEmergencia, restricoesMedicas, fotoPerfil,
        endereco_idendereco, peso, altura, sexo, objetivo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        dados.nome,
        dados.senha,
        dados.cpf,
        dados.dataDeNascimento || null,
        dados.email || null,
        dados.telefone || null,
        dados.telefoneDeEmergencia || null,
        dados.restricoesMedicas || null,
        dados.fotoPerfil || null,
        enderecoId,
        dados.peso || null,
        dados.altura || null,
        dados.sexo || null,
        dados.objetivo || null
      ]
    );

    await conexao.commit();
    console.log("✅ Cliente cadastrado com sucesso:", resultadoCliente);

    return {
      sucesso: true,
      clienteId: resultadoCliente.insertId,
      mensagem: "Cliente cadastrado com sucesso!",
    };

  } catch (erro) {  
    await conexao.rollback();
    console.error('Erro ao cadastrar cliente:', erro);
    throw erro;
  } finally {
    conexao.release();
  }
}