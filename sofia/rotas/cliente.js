import express from 'express';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage });
const routerCliente = express.Router();
import { cadastrarCliente } from '../servico/adicionarJson.js';
import {
  retornaClientes,
  retornaClientesPorNome
} from '../servico/buscar.js';

import { deletarClientePorId } from '../servico/deletar.js';
import {
  atualizarCliente,
  atualizarClienteParcial
} from '../servico/atualizar.js';

import {
  validarCliente,
  validarAtualizacaoCliente
} from '../validacao/validacaoCliente.js';

routerCliente.patch('/:id', upload.fields([
  { name: 'fotoPerfil', maxCount: 1 }
]), async (req, res) => {
  const id = req.params.id;
  const {
    nome, senha, cpf, dataDeNascimento, email, telefone,
    cep, numeroCasa, complemento, idEndereco,
    peso, altura, sexo, objetivo
  } = req.body;

  const fotoPerfilBuffer = req.files?.fotoPerfil?.[0]?.buffer;

  const dados = {};
  if (nome !== undefined) dados.nome = nome;
  if (senha !== undefined) dados.senha = senha;
  if (cpf !== undefined) dados.cpf = cpf;
  if (dataDeNascimento !== undefined) dados.dataDeNascimento = dataDeNascimento;
  if (email !== undefined) dados.email = email;
  if (telefone !== undefined) dados.telefone = telefone;
  if (peso !== undefined) dados.peso = peso;
  if (altura !== undefined) dados.altura = altura;
  if (sexo !== undefined) dados.sexo = sexo;
  if (objetivo !== undefined) dados.objetivo = objetivo;
  if (fotoPerfilBuffer !== undefined) dados.fotoPerfil = fotoPerfilBuffer;

  if (cep || numeroCasa || complemento || idEndereco) {
    dados.endereco = {};
    if (cep !== undefined) dados.endereco.cep = cep;
    if (numeroCasa !== undefined) dados.endereco.numeroCasa = numeroCasa;
    if (complemento !== undefined) dados.endereco.complemento = complemento;
    if (idEndereco !== undefined) dados.endereco.idEndereco = Number(idEndereco);
  }

  const erros = validarAtualizacaoCliente(dados);
  if (erros.length > 0) {
    return res.status(400).json({ erros });
  }

  try {
    const resultado = await atualizarClienteParcial(id, dados);
    if (resultado) {
      res.status(200).json({ mensagem: 'Cliente atualizado com sucesso!' });
    } else {
      res.status(404).json({ mensagem: 'Cliente não encontrado ou nenhum dado alterado.' });
    }
  } catch (erro) {
    console.error('Erro ao atualizar cliente:', erro);
    res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
});

routerCliente.put('/:id', upload.fields([
  { name: 'fotoPerfil', maxCount: 1 }
]), validarAtualizacaoCliente, async (req, res) => {
  const id = req.params.id;
  const {
    nome, senha, cpf, dataDeNascimento, email, telefone,
    cep, numeroCasa, complemento, peso, altura, sexo, objetivo
  } = req.body;
  const fotoPerfilBuffer = req.files?.fotoPerfil?.[0]?.buffer;

  const dados = {
    nome,
    senha,
    cpf,
    dataDeNascimento,
    email,
    telefone,
    peso,
    altura,
    sexo,
    objetivo,
    fotoPerfil: fotoPerfilBuffer,
    endereco: {
      cep,
      numeroCasa,
      complemento
    }
  };

  try {
    const resultado = await atualizarCliente(id, dados);
    if (resultado) {
      res.status(200).json({ mensagem: 'Cliente atualizado com sucesso!' });
    } else {
      res.status(404).json({ mensagem: 'Cliente não encontrado ou nenhum dado alterado.' });
    }
  } catch (erro) {
    console.error('Erro ao atualizar cliente:', erro);
    res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
});

routerCliente.get('/', async (req, res) => {
  let resultado;
  const nome = req.query.nome;

  try {
    if (!nome) {
      resultado = await retornaClientes();
    } else {
      if (!/[a-zA-Z]/.test(nome)) {
        return res.status(400).json({ mensagem: "Por favor, informe um nome válido para buscar." });
      }
      resultado = await retornaClientesPorNome(nome);
    }

    if (resultado.length > 0) {
      res.json(resultado);
    } else {
      res.status(404).json({ mensagem: "Nenhum cliente encontrado" });
    }
  } catch (erro) {
    console.error("Erro ao buscar clientes:", erro);
    res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});

routerCliente.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const cliente = await retornaClientePorid(id);
    if (!cliente) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado para o ID informado.' });
    }
    res.status(200).json(cliente);
  } catch (erro) {
    console.error('Erro ao buscar cliente por ID:', erro);
    res.status(500).json({ mensagem: 'Erro interno no servidor ao buscar cliente.' });
  }
});

routerCliente.get('/:id/fotoPerfil', async (req, res) => {
  const id = req.params.id;
  try {
    const cliente = await buscarFotoPerfilPorId(id);
    if (!cliente || !cliente.fotoPerfil) {
      return res.status(404).json({ erro: 'Foto de perfil não encontrada.' });
    }
    res.setHeader('Content-Type', 'image/jpeg');
    res.send(cliente.fotoPerfil);
  } catch (erro) {
    console.error('Erro ao buscar foto de perfil:', erro);
    res.status(500).json({ erro: 'Erro ao buscar foto de perfil.' });
  }
});


routerCliente.post('/', upload.single('fotoPerfil'), async (req, res) => {
  try {
    console.log('🔥 Requisição recebida:', req.body);

    const dados = {
      nome: req.body.nome,
      cpf: req.body.cpf,
      dataDeNascimento: req.body.dataDeNascimento,
      email: req.body.email,
      telefone: req.body.telefone,
      telefoneDeEmergencia: req.body.telefoneDeEmergencia,
      restricoesMedicas: req.body.restricoesMedicas,
      senha: req.body.senha,
      fotoPerfil: req.file?.buffer || null,
      endereco: {
        cep: req.body.cep,
        numeroCasa: req.body.numeroCasa,
        complemento: req.body.complemento
      },
      peso: req.body.peso,
      altura: req.body.altura,
      sexo: req.body.sexo,
      objetivo: req.body.objetivo
    };

    const cliente = await cadastrarCliente(dados);
    res.status(201).json({ mensagem: 'Cliente cadastrado com sucesso', cliente });
  } catch (erro) {
    console.error('Erro na rota POST /api/cliente:', erro);
    res.status(500).json({ mensagem: 'Erro ao cadastrar cliente.' });
  }
});


routerCliente.delete('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const resultado = await deletarClientePorId(id);
    if (resultado.affectedRows > 0) {
      res.json({ mensagem: 'Cliente deletado com sucesso' });
    } else {
      res.status(404).json({ mensagem: 'Cliente não encontrado' });
    }
  } catch (erro) {
    console.error('Erro ao deletar cliente:', erro);
    res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
});

export default routerCliente;
