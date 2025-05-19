// Aqui serÃo colocadas todos os endpoints da API

import express from 'express';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');

const app = express();
app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));



import routerEndereco from './ana/rotas/endereco.js';
import routerFuncionario from './ana/rotas/funcionarios.js';
import routerFrequencia from './maria/rotas/frequencia.js';
import routerFormacao from './maria/rotas/rotAformacao.js';
import routerMarca from './anne/rotas/marca.js';
import routerCliente from './sofia/rotas/cliente.js';
import routerEquipamentos from './anne/rotas/equipamento.js';
import routerExercicios from './luz/rotas/exercicios.js';

app.use('/funcionarios', routerFuncionario)
app.use('/endereco', routerEndereco)
app.use('/frequencia', routerFrequencia)
app.use('/formacao', routerFormacao)
app.use('/marca', routerMarca)
app.use('/cliente', routerCliente)
app.use('/equipamentos', routerEquipamentos)
app.use('/exercicios', routerExercicios)

app.listen(9000, () => {
    const data = new Date();
    console.log("Servidor  rodando em: " + data);
});
