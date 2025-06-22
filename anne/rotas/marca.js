import express from 'express';
import { apresentarMarca, apresentarMarcaPorId, apresentarMarcaPorNome } from '../servicos/marcaServicos/buscar.js';
import { adicionarMarca } from '../servicos/marcaServicos/adicionar.js';
import { validarMarca, validarMarcaParcial } from '../validacao/marcaValidacao.js';
import { deletarMarca } from '../servicos/marcaServicos/deletar.js';
import { editarMarca } from '../servicos/marcaServicos/editar.js';

const routerMarca = express.Router();

routerMarca.put('/:id', async (req, res) => {
    /* 
  #swagger.tags = ['Marcas']
  #swagger.description = 'Edita o nome de uma marca existente.'
  #swagger.parameters['id'] = {
    in: 'path',
    description: 'ID da marca.',
    required: true,
    type: 'integer',
    example: 2
  }
  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      nome: 'Nova Marca'
    }
  }
  #swagger.responses[200] = {
    description: 'Marca editada com sucesso.',
    schema: { status: 'success', mensagem: 'Marca editada com sucesso!' }
  }
  #swagger.responses[400] = {
    description: 'ID inválido ou nome inválido.',
    schema: { status: 'error', mensagem: 'ID inválido ou nome da marca é obrigatório' }
  }
  #swagger.responses[404] = {
    description: 'Marca não encontrada.',
    schema: { status: 'error', mensagem: 'Marca não encontrada' }
  }
*/
    const { id } = req.params;
    const { nome } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({ status: 'error', mensagem: 'ID inválido' });
    }

    if (!nome) {
        return res.status(400).json({ status: 'error', mensagem: 'Nome da marca é obrigatório' });
    }

    const nomeValido = await validarMarcaParcial(nome);
    if (!nomeValido.status) {
        return res.status(400).json({ status: 'error', mensagem: nomeValido.mensagem });
    }

    const resultado = await editarMarca(id, nome);
    if (resultado.affectedRows === 0) {
        return res.status(404).json({ status: 'error', mensagem: 'Marca não encontrada' });
    }

    return res.status(200).json({ status: 'success', mensagem: 'Marca editada com sucesso!' });
});

routerMarca.post('/', async (req, res) => {
    /* 
  #swagger.tags = ['Marcas']
  #swagger.description = 'Cadastra uma nova marca.'
  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      nome: 'Nova Marca'
    }
  }
  #swagger.responses[201] = {
    description: 'Marca cadastrada com sucesso.',
    schema: { status: 'success', mensagem: 'Marca cadastrada com sucesso!' }
  }
  #swagger.responses[400] = {
    description: 'Nome inválido.',
    schema: { status: 'error', mensagem: 'Nome da marca é obrigatório.' }
  }
*/
    const { nome } = req.body;
    if (!nome) {
        return res.status(400).json({ status: 'error', mensagem: 'Nome da marca é obrigatório.' });
    }

    const nomeValido = await validarMarca(nome);
    if (!nomeValido.status) {
        return res.status(400).json({ status: 'error', mensagem: nomeValido.mensagem });
    }

    const resultado = await adicionarMarca(nome);
    return res.status(201).json({ status: 'success', mensagem: 'Marca cadastrada com sucesso!', id: resultado.insertId });
});

routerMarca.get('/', async (req, res) => {
    /* 
  #swagger.tags = ['Marcas']
  #swagger.description = 'Lista todas as marcas ou busca por nome.'
  #swagger.parameters['nome'] = {
    in: 'query',
    description: 'Nome da marca para busca.',
    required: false,
    type: 'string',
    example: 'Smart Fit'
  }
  #swagger.responses[200] = {
    description: 'Lista de marcas ou resultado da busca.',
    schema: {
      status: 'success',
      dados: [
        { id: 1, nome: 'Smart Fit' },
        { id: 2, nome: 'TechnoGym' }
      ]
    }
  }
  #swagger.responses[404] = {
    description: 'Marca com esse nome não encontrada.',
    schema: { status: 'error', mensagem: 'Marca com esse nome não encontrada' }
  }
*/
    const { nome } = req.query;

    const resultado = nome
        ? await apresentarMarcaPorNome(nome)
        : await apresentarMarca();

    if (nome && !resultado.length) {
        return res.status(404).json({ status: 'error', mensagem: 'Marca com esse nome não encontrada' });
    }

    return res.status(200).json({ status: 'success', dados: resultado });
});

routerMarca.get('/:id', async (req, res) => {
    /* 
  #swagger.tags = ['Marcas']
  #swagger.description = 'Busca uma marca pelo ID.'
  #swagger.parameters['id'] = {
    in: 'path',
    description: 'ID da marca.',
    required: true,
    type: 'integer',
    example: 1
  }
  #swagger.responses[200] = {
    description: 'Marca encontrada.',
    schema: {
      status: 'success',
      dados: [
        { id: 1, nome: 'Smart Fit' }
      ]
    }
  }
  #swagger.responses[400] = {
    description: 'ID inválido.',
    schema: { status: 'error', mensagem: 'ID inválido' }
  }
  #swagger.responses[404] = {
    description: 'Marca não encontrada.',
    schema: { status: 'error', mensagem: 'Marca não encontrada' }
  }
*/
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ status: 'error', mensagem: 'ID inválido' });
    }

    const resultado = await apresentarMarcaPorId(id);
    if (!resultado.length) {
        return res.status(404).json({ status: 'error', mensagem: 'Marca não encontrada' });
    }

    return res.status(200).json({ status: 'success', dados: resultado });
});

routerMarca.delete('/:id', async (req, res) => {
    /* 
  #swagger.tags = ['Marcas']
  #swagger.description = 'Deleta uma marca pelo ID.'
  #swagger.parameters['id'] = {
    in: 'path',
    description: 'ID da marca.',
    required: true,
    type: 'integer',
    example: 2
  }
  #swagger.responses[200] = {
    description: 'Marca deletada com sucesso.',
    schema: { status: 'success', mensagem: 'Marca deletada com sucesso!' }
  }
  #swagger.responses[400] = {
    description: 'ID inválido.',
    schema: { status: 'error', mensagem: 'ID inválido' }
  }
  #swagger.responses[404] = {
    description: 'Marca não encontrada.',
    schema: { status: 'error', mensagem: 'Marca não encontrada' }
  }
*/
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ status: 'error', mensagem: 'ID inválido' });
    }

    const resultado = await deletarMarca(id);
    if (resultado.affectedRows === 0) {
        return res.status(404).json({ status: 'error', mensagem: 'Marca não encontrada' });
    }

    return res.status(200).json({ status: 'success', mensagem: 'Marca deletada com sucesso!' });
});

export default routerMarca;
