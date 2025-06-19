// MÉTODO PUT E PATCH
import pool from "../../conexao.js";

async function executaQuery(conexao, query, params = []) {
	const [rows] = await conexao.execute(query, params);
	return rows;
}

export async function atualizarCliente(cliente) {
	const {
		idclientes,
		nome,
		cpf,
		dataDeNascimento,
		email,
		telefone,
		contatoDeEmergencia,
		peso,
		altura,
		sexo,
		objetivo,
		endereco: {
			idendereco,
			cep,
			numeroCasa,
			complemento
		},
		senha
	} = cliente;

	const conexao = await pool.getConnection();
	try {
		await conexao.beginTransaction();

		const queryCliente = `
			UPDATE clientes SET
				nome = ?, cpf = ?, dataDeNascimento = ?, email = ?,
				telefone = ?, contatoDeEmergencia = ?, peso = ?, altura = ?,
				sexo = ?, objetivo = ?, senha = ?
			WHERE idclientes = ?
		`;

		const clienteParams = [
			nome, cpf, dataDeNascimento, email,
			telefone, contatoDeEmergencia, peso, altura,
			sexo, objetivo, senha, idclientes
		];

		await executaQuery(conexao, queryCliente, clienteParams);

		let idEnderecoFinal = idendereco;
		if (!idEnderecoFinal) {
			const [resCliente] = await conexao.execute(
				`SELECT endereco_idendereco FROM clientes WHERE idclientes = ?`,
				[idclientes]
			);

			if (resCliente.length === 0) {
				throw new Error("Cliente não encontrado.");
			}

			idEnderecoFinal = resCliente[0].endereco_idendereco;
		}

		const queryEndereco = `
			UPDATE endereco SET
				cep = ?, numeroCasa = ?, complemento = ?
			WHERE idendereco = ?
		`;

		const enderecoParams = [cep, numeroCasa, complemento, idEnderecoFinal];
		await executaQuery(conexao, queryEndereco, enderecoParams);

		await conexao.commit();
		return { sucesso: true };
	} catch (error) {
		await conexao.rollback();
		throw error;
	} finally {
		conexao.release();
	}
}


export async function atualizarClienteParcial(idclientes, campos) {
	const conexao = await pool.getConnection();
	try {
		await conexao.beginTransaction();

		// Atualizar cliente
		const camposValidosCliente = [
			'nome', 'cpf', 'dataDeNascimento', 'email', 'telefone',
			'contatoDeEmergencia', 'peso', 'altura', 'sexo', 'objetivo', 'fotoPerfil', 'senha'
		];

		const camposCliente = Object.entries(campos)
			.filter(([key]) => camposValidosCliente.includes(key));

		if (camposCliente.length > 0) {
			const setCliente = camposCliente.map(([campo]) => `${campo} = ?`).join(', ');
			const valoresCliente = camposCliente.map(([, valor]) => valor);

			const queryCliente = `UPDATE clientes SET ${setCliente} WHERE idclientes = ?`;
			await executaQuery(conexao, queryCliente, [...valoresCliente, idclientes]);
		}

		// Atualizar endereço
		if (campos.endereco) {
			const { idendereco, ...camposEndereco } = campos.endereco;

			if (!idendereco) throw new Error('idendereco é obrigatório no PATCH de endereço');

			const setEndereco = Object.keys(camposEndereco).map(c => `${c} = ?`).join(', ');
			const valoresEndereco = Object.values(camposEndereco);

			const queryEndereco = `UPDATE endereco SET ${setEndereco} WHERE idendereco = ?`;
			await executaQuery(conexao, queryEndereco, [...valoresEndereco, idendereco]);
		}

		await conexao.commit();
		return { sucesso: true };
	} catch (erro) {
		await conexao.rollback();
		throw erro;
	} finally {
		conexao.release();
	}
}

