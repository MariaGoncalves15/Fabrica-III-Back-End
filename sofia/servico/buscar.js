//MÉTODO GET
import pool from "../../conexao.js";

async function executaQuery(conexao, query) {
	const [rows] = await conexao.execute(query);
	return rows;
}

export async function retornaClientes() {
	const conexao = await pool.getConnection();
	const query = `
		SELECT 
			clientes.idclientes,
			clientes.nome,
			clientes.cpf,
			DATE_FORMAT(clientes.dataDeNascimento, '%Y-%m-%d') AS dataDeNascimento,  -- Formatação da data
			clientes.email,
			clientes.telefone,
			clientes.contatoDeEmergencia,
			endereco.cep,
			endereco.numeroCasa,
			endereco.complemento,
			clientes.peso,
			clientes.altura,
			clientes.sexo,
			clientes.objetivo
		FROM clientes 
		INNER JOIN endereco ON clientes.endereco_idendereco = endereco.idendereco
		ORDER BY clientes.nome
	`;
	const resultado = await executaQuery(conexao, query);
	conexao.release();
	return resultado;
}


export async function retornaClientesPorNome(nome) {
	const conexao = await pool.getConnection();
	const query = `
		SELECT 
			clientes.nome,
			clientes.telefone,
			clientes.email
		FROM clientes 
		WHERE clientes.nome LIKE '%${nome}%'
	`;
	const resultado = await executaQuery(conexao, query);
	conexao.release();
	return resultado;
}

export async function retornaClientePorId(id) {
	const conexao = await pool.getConnection();
	const query =
		`SELECT * FROM clientes
		 JOIN endereco ON clientes.endereco_idendereco = endereco.idendereco
		 WHERE clientes.idclientes = ${id}`;
	const resultado = await executaQuery(conexao, query);
	conexao.release();
	return resultado;
}
