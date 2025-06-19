import express from 'express';
import multer from 'multer';
const storage = multer.memoryStorage(); // salva o arquivo em buffer
const upload = multer({ storage: storage });
const routerCliente= express.Router();
import { retornaClientes, retornaClientesPorNome } from '../servico/buscar.js';
import { cadastrarCliente } from '../servico/adicionar.js';
import { atualizarCliente } from '../servico/atualizar.js';
import { atualizarClienteParcial } from '../servico/atualizar.js';
import { retornaClientePorId } from '../servico/buscar.js';
import { deletarClientePorId } from '../servico/deletar.js';

routerCliente.get('/', async (req, res) => {
	// #swagger.tags = ['Cliente']
// #swagger.description = 'Retorna a lista de todos os clientes ou busca clientes pelo nome via query parameter.'
/* #swagger.parameters['nome'] = {
    description: 'Nome do cliente para busca',
    type: 'string',
    in: 'query',
    required: false
} */
/* #swagger.responses[200] = {
    description: 'Lista de clientes retornada com sucesso.',
    schema: [
      {
        idclientes: 1,
        nome: 'João Silva',
        cpf: '123.456.789-00',
        dataDeNascimento: '1990-01-01',
        email: 'joao@email.com',
        telefone: '(11) 99999-9999',
        contatoDeEmergencia: '(11) 98888-8888',
        peso: 75,
        altura: 1.75,
        sexo: 'M',
        objetivo: 'Emagrecimento',
        fotoPerfil: 'Buffer',
        endereco: {
          cep: '12345-678',
          numeroCasa: '123A',
          complemento: 'Apto 12'
        }
      }
    ]
} */
/* #swagger.responses[404] = {
    description: 'Nenhum cliente encontrado.',
    schema: { mensagem: 'Nenhum cliente encontrado' }
} */
/* #swagger.responses[500] = {
    description: 'Erro interno no servidor ao buscar clientes.',
    schema: { mensagem: 'Erro interno no servidor' }
} */
	let resultado;
	const nome = req.query.nome;

	try {
		if (!nome) {
			resultado = await retornaClientes();
		} else if (nome) {
			resultado = await retornaClientesPorNome(nome);
		} 

		if (resultado.length > 0) {
			res.json(resultado);
		} else {
			res.status(404).json({ mensagem: "Nenhum cliente encontrado" });
		}
	} catch (erro) {
		console.error("Erro ao buscar cliente:", erro);
		console.log(resultado)
		res.status(500).json({ mensagem: "Erro interno no servidor" });
	}
});
routerCliente.get('/:id', async (req, res) => {
	// #swagger.tags = ['Cliente']
// #swagger.description = 'Retorna os dados de um cliente pelo seu ID.'
/* #swagger.parameters['id'] = {
    description: 'ID do cliente',
    type: 'integer',
    in: 'path',
    required: true
} */
/* #swagger.responses[200] = {
    description: 'Cliente encontrado e retornado com sucesso.',
    schema: {
      idclientes: 1,
      nome: 'João Silva',
      cpf: '123.456.789-00',
      dataDeNascimento: '1990-01-01',
      email: 'joao@email.com',
      telefone: '(11) 99999-9999',
      contatoDeEmergencia: '(11) 98888-8888',
      peso: 75,
      altura: 1.75,
      sexo: 'M',
      objetivo: 'Emagrecimento',
      fotoPerfil: 'Buffer',
      endereco: {
        cep: '12345-678',
        numeroCasa: '123A',
        complemento: 'Apto 12'
      }
    }
} */
/* #swagger.responses[404] = {
    description: 'Cliente não encontrado.',
    schema: { mensagem: 'Cliente não encontrado' }
} */
/* #swagger.responses[500] = {
    description: 'Erro interno no servidor ao buscar cliente.',
    schema: { mensagem: 'Erro interno no servidor' }
} */

	const { id } = req.params;

	try {
		const resultado = await retornaClientePorId(id);
		console.log("Resultado:", resultado);

		if (resultado.length > 0) {
			res.json(resultado[0]);
		} else {
			res.status(404).json({ mensagem: "Cliente não encontrado" });
		}
	} catch (erro) {
		console.error("Erro ao buscar cliente por ID:", erro.message);
		res.status(500).json({ mensagem: "Erro interno no servidor" });
	}
});


routerCliente.post('/', upload.fields([
  { name: 'fotoPerfil', maxCount: 1 }
]), async (req, res) => {
	// #swagger.tags = ['Cliente']
// #swagger.description = 'Cadastra um novo cliente com dados completos, incluindo foto de perfil opcional.'
/* #swagger.consumes = ['multipart/form-data'] */
/* #swagger.parameters['nome'] = {
    description: 'Nome do cliente',
    type: 'string',
    in: 'formData',
    required: true
} */
/* #swagger.parameters['cpf'] = {
    description: 'CPF do cliente',
    type: 'string',
    in: 'formData',
    required: true
} */
/* #swagger.parameters['dataDeNascimento'] = {
    description: 'Data de nascimento do cliente',
    type: 'string',
    format: 'date',
    in: 'formData',
    required: true
} */
/* #swagger.parameters['email'] = {
    description: 'E-mail do cliente',
    type: 'string',
    in: 'formData',
    required: true
} */
/* #swagger.parameters['telefone'] = {
    description: 'Telefone do cliente',
    type: 'string',
    in: 'formData',
    required: true
} */
/* #swagger.parameters['contatoDeEmergencia'] = {
    description: 'Contato de emergência do cliente',
    type: 'string',
    in: 'formData',
    required: false
} */
/* #swagger.parameters['cep'] = {
    description: 'CEP do endereço',
    type: 'string',
    in: 'formData',
    required: true
} */
/* #swagger.parameters['numeroCasa'] = {
    description: 'Número da casa',
    type: 'string',
    in: 'formData',
    required: true
} */
/* #swagger.parameters['complemento'] = {
    description: 'Complemento do endereço',
    type: 'string',
    in: 'formData',
    required: false
} */
/* #swagger.parameters['peso'] = {
    description: 'Peso do cliente',
    type: 'number',
    in: 'formData',
    required: true
} */
/* #swagger.parameters['altura'] = {
    description: 'Altura do cliente',
    type: 'number',
    in: 'formData',
    required: true
} */
/* #swagger.parameters['sexo'] = {
    description: 'Sexo do cliente',
    type: 'string',
    enum: ['M', 'F'],
    in: 'formData',
    required: true
} */
/* #swagger.parameters['objetivo'] = {
    description: 'Objetivo do cliente',
    type: 'string',
    in: 'formData',
    required: true
} */
/* #swagger.parameters['fotoPerfil'] = {
    description: 'Foto de perfil do cliente (arquivo)',
    type: 'file',
    in: 'formData',
    required: false
} */
/* #swagger.responses[201] = {
    description: 'Cliente cadastrado com sucesso.',
    schema: {
      mensagem: 'Cliente cadastrado com sucesso',
      id: 123
    }
} */
/* #swagger.responses[500] = {
    description: 'Erro ao cadastrar cliente.',
    schema: { erro: 'Erro ao cadastrar cliente' }
} */
  const {
	nome, cpf, dataDeNascimento, email, telefone,
	contatoDeEmergencia, cep, numeroCasa, complemento,
	peso, altura, sexo, objetivo, senha
  } = req.body;

  const fotoPerfilBuffer = req.files?.fotoPerfil?.[0]?.buffer;
  const dados = {
	nome, cpf, dataDeNascimento, email, telefone,
	contatoDeEmergencia, peso, altura, sexo,
	objetivo, fotoPerfil: fotoPerfilBuffer,
	endereco: {
	  cep,
	  numeroCasa,
	  complemento
	}, senha
  };

  try {
	const resultado = await cadastrarCliente(dados);
	res.status(201).json({
	  mensagem: 'Cliente cadastrado com sucesso',
	  id: resultado.insertId
	});
  } catch (erro) {
	console.error("Erro ao cadastrar cliente:", erro);
	res.status(500).json({ erro: 'Erro ao cadastrar cliente' });
  }
});

routerCliente.put('/:id', upload.none(), async (req, res) => {
	// #swagger.tags = ['Cliente']
// #swagger.description = 'Atualiza os dados completos de um cliente pelo ID.'
/* #swagger.parameters['id'] = {
    description: 'ID do cliente',
    type: 'integer',
    in: 'path',
    required: true
} */
/* #swagger.parameters['nome'] = {
    description: 'Nome do cliente',
    type: 'string',
    in: 'formData',
    required: true
} */
/* #swagger.parameters['cpf'] = {
    description: 'CPF do cliente',
    type: 'string',
    in: 'formData',
    required: true
} */
/* #swagger.parameters['dataDeNascimento'] = {
    description: 'Data de nascimento do cliente',
    type: 'string',
    format: 'date',
    in: 'formData',
    required: true
} */
/* #swagger.parameters['email'] = {
    description: 'E-mail do cliente',
    type: 'string',
    in: 'formData',
    required: true
} */
/* #swagger.parameters['telefone'] = {
    description: 'Telefone do cliente',
    type: 'string',
    in: 'formData',
    required: true
} */
/* #swagger.parameters['contatoDeEmergencia'] = {
    description: 'Contato de emergência',
    type: 'string',
    in: 'formData',
    required: false
} */
/* #swagger.parameters['cep'] = {
    description: 'CEP do endereço',
    type: 'string',
    in: 'formData',
    required: true
} */
/* #swagger.parameters['numeroCasa'] = {
    description: 'Número da casa',
    type: 'string',
    in: 'formData',
    required: true
} */
/* #swagger.parameters['complemento'] = {
    description: 'Complemento do endereço',
    type: 'string',
    in: 'formData',
    required: false
} */
/* #swagger.parameters['peso'] = {
    description: 'Peso do cliente',
    type: 'number',
    in: 'formData',
    required: true
} */
/* #swagger.parameters['altura'] = {
    description: 'Altura do cliente',
    type: 'number',
    in: 'formData',
    required: true
} */
/* #swagger.parameters['sexo'] = {
    description: 'Sexo do cliente',
    type: 'string',
    enum: ['M', 'F'],
    in: 'formData',
    required: true
} */
/* #swagger.parameters['objetivo'] = {
    description: 'Objetivo do cliente',
    type: 'string',
    in: 'formData',
    required: true
} */
/* #swagger.parameters['idendereco'] = {
    description: 'ID do endereço',
    type: 'integer',
    in: 'formData',
    required: true
} */
/* #swagger.responses[200] = {
    description: 'Cliente atualizado com sucesso.',
    schema: { mensagem: 'Cliente atualizado com sucesso' }
} */
/* #swagger.responses[400] = {
    description: 'Falha ao atualizar cliente.',
    schema: { mensagem: 'Falha ao atualizar cliente' }
} */
/* #swagger.responses[500] = {
    description: 'Erro ao atualizar cliente.',
    schema: { erro: 'Erro ao atualizar cliente' }
} */

  const { id } = req.params;

  const {
	nome, cpf, dataDeNascimento, email, telefone, contatoDeEmergencia, 
	cep, numeroCasa, complemento, peso,
	altura, sexo, objetivo,
	idendereco, senha
  } = req.body;

  const dados = {
	idclientes: id, nome, cpf, dataDeNascimento,
	email, telefone, contatoDeEmergencia,
	peso, altura, sexo, objetivo,
	endereco: {
	  idendereco,
	  cep,
	  numeroCasa,
	  complemento
	}, senha
  };

  try {
	const resultado = await atualizarCliente(dados);

	if (resultado.sucesso) {
	  res.json({ mensagem: 'Cliente atualizado com sucesso' });
	} else {
	  res.status(400).json({ mensagem: 'Falha ao atualizar cliente' });
	}
  } catch (erro) {
	console.error("Erro ao atualizar cliente:", erro);
	res.status(500).json({ erro: 'Erro ao atualizar cliente' });
  }
});

routerCliente.patch('/:id', upload.none(), async (req, res) => {
	// #swagger.tags = ['Cliente']
// #swagger.description = 'Atualiza parcialmente os dados de um cliente pelo ID.'
/* #swagger.parameters['id'] = {
    description: 'ID do cliente',
    type: 'integer',
    in: 'path',
    required: true
} */
/* #swagger.parameters['body'] = {
    description: 'Dados parciais para atualização (JSON). Pode incluir "endereco" como objeto JSON.',
    type: 'object',
    in: 'body',
    required: true
} */
/* #swagger.responses[200] = {
    description: 'Dados atualizados com sucesso.',
    schema: { mensagem: 'Dados atualizados com sucesso' }
} */
/* #swagger.responses[400] = {
    description: 'Falha ao atualizar cliente.',
    schema: { mensagem: 'Falha ao atualizar cliente' }
} */
/* #swagger.responses[500] = {
    description: 'Erro ao atualizar parcialmente cliente.',
    schema: { erro: 'Erro ao atualizar parcialmente cliente' }
} */
	const { id } = req.params;

	try {
		const dadosParciais = req.body;

		if (dadosParciais.endereco && typeof dadosParciais.endereco === 'string') {
			dadosParciais.endereco = JSON.parse(dadosParciais.endereco);
		}

		const resultado = await atualizarClienteParcial(id, dadosParciais);

		if (resultado.sucesso) {
			res.json({ mensagem: 'Dados atualizados com sucesso' });
		} else {
			res.status(400).json({ mensagem: 'Falha ao atualizar cliente' });
		}
	} catch (erro) {
		console.error('Erro ao atualizar parcialmente cliente:', erro);
		res.status(500).json({ erro: 'Erro ao atualizar parcialmente cliente' });
	}
});

routerCliente.delete('/:id', async (req, res) => {
	// #swagger.tags = ['Cliente']
// #swagger.description = 'Deleta um cliente pelo seu ID.'
/* #swagger.parameters['id'] = {
    description: 'ID do cliente',
    type: 'integer',
    in: 'path',
    required: true
} */
/* #swagger.responses[200] = {
    description: 'Cliente deletado com sucesso.',
    schema: { mensagem: 'Cliente deletado com sucesso' }
} */
/* #swagger.responses[404] = {
    description: 'Cliente não encontrado.',
    schema: { mensagem: 'Cliente não encontrado' }
} */
/* #swagger.responses[500] = {
    description: 'Erro ao deletar cliente.',
    schema: { erro: 'Erro ao deletar cliente' }
} */
	const { id } = req.params;

	try {
		const resultado = await deletarClientePorId(id);

		if (resultado.affectedRows > 0) {
			res.json({ mensagem: 'Cliente deletado com sucesso' });
		} else {
			res.status(404).json({ mensagem: 'Cliente não encontrado' });
		}
	} catch (erro) {
		console.error("Erro ao deletar cliente:", erro);
		res.status(500).json({ erro: 'Erro ao deletar cliente' });
	}
});

export default routerCliente;