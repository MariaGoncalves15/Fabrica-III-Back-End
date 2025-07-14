import pool from '../config/db.js'; // Ajuste o caminho conforme seu projeto

export async function cadastrarCliente(dados) {
  console.log("Entrou na função cadastrarCliente com dados:", dados);

  const conexao = await pool.getConnection();

  try {
    await conexao.beginTransaction();

    if (!dados.nome || !dados.cpf || !dados.senha) {
      throw new Error("Dados obrigatórios ausentes: nome, cpf e senha são necessários.");
    }

    console.log('Começando a inserção no banco...');

    // Inserir endereço, se existir dados
    let enderecoId = null;
    if (dados.endereco && (dados.endereco.cep || dados.endereco.numeroCasa || dados.endereco.complemento)) {
      const [resultadoEndereco] = await conexao.execute(
        `INSERT INTO endereco (cep, numeroCasa, complemento) VALUES (?, ?, ?)`,
        [
          dados.endereco.cep ?? null,
          dados.endereco.numeroCasa ?? null,
          dados.endereco.complemento ?? null
        ]
      );
      enderecoId = resultadoEndereco.insertId;
      console.log('Endereço inserido com id:', enderecoId);
    }

    // Tratar telefoneDeEmergencia para não inserir string vazia
    const telefoneEmergenciaTratado = dados.telefoneDeEmergencia && dados.telefoneDeEmergencia.trim() !== '' 
      ? dados.telefoneDeEmergencia 
      : null;

    // Inserir cliente
    const [resultadoCliente] = await conexao.execute(
      `INSERT INTO clientes (
         nome, cpf, dataDeNascimento, email, telefone, telefoneDeEmergencia,
         restricoesMedicas, peso, altura, sexo, objetivo, fotoPerfil, endereco_idendereco, senha
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

    console.log('Cliente inserido, resultado:', resultadoCliente);

    await conexao.commit();

    return { id: resultadoCliente.insertId };
  } catch (erro) {
    console.error('Erro no cadastro:', erro);
    await conexao.rollback();
    throw erro;
  } finally {
    conexao.release();
  }
}
