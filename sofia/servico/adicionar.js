// MÉTODO POST
import pool from "../../conexao.js";

export async function cadastrarCliente(dados) {
	const conexao = await pool.getConnection();
	console.log("Dados recebidos para cadastro:", dados);

	try {
		await conexao.beginTransaction();

		if (!dados?.endereco?.cep || !dados.nome || !dados.cpf || !dados.senha) {
			throw new Error("Dados obrigatórios ausentes.");
		}

		const [resultadoEndereco] = await conexao.execute(
			`INSERT INTO endereco (cep, numeroCasa, complemento)
			 VALUES (?, ?, ?)`,
			[
				dados.endereco.cep ?? null,
				dados.endereco.numeroCasa ?? null,
				dados.endereco.complemento ?? null
			]
		);

		const enderecoId = resultadoEndereco.insertId;

		const [resultadoCliente] = await conexao.execute(
			`INSERT INTO clientes (
				nome, cpf, dataDeNascimento,
				email, telefone, contatoDeEmergencia,
				peso, altura, sexo,
				objetivo, fotoPerfil, endereco_idendereco, senha
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				dados.nome ?? null,
				dados.cpf ?? null,
				dados.dataDeNascimento ?? null,
				dados.email ?? null,
				dados.telefone ?? null,
				dados.contatoDeEmergencia ?? null,
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
		await conexao.rollback();
		console.error("Erro ao cadastrar cliente:", erro.message);
		throw erro;
	} finally {
		conexao.release();
	}
}
