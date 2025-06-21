// servico/adicionarJson.js
import fs from 'fs/promises';
import path from 'path';

const arquivoClientes = path.resolve('./clientes.json');

export async function cadastrarCliente(dados) {
  try {
    let clientes = [];
    try {
      const dadosArquivo = await fs.readFile(arquivoClientes, 'utf8');
      clientes = JSON.parse(dadosArquivo);
    } catch {
      clientes = [];
    }

    if (!dados.telefoneDeEmergencia || dados.telefoneDeEmergencia.trim() === '') {
      delete dados.telefoneDeEmergencia;
    }

    clientes.push(dados);

    await fs.writeFile(arquivoClientes, JSON.stringify(clientes, null, 2));

    console.log("Cliente cadastrado com sucesso.");
    return { sucesso: true };
  } catch (erro) {
    console.error("Erro ao cadastrar cliente:", erro.message);
    throw erro;
  }
}
