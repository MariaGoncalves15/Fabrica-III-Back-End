// Aqui serÃo colocadas todos os endpoints da API

// import express from 'express';
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);


// const swaggerUi = require('swagger-ui-express');
// const swaggerFile = require('./swagger-output.json');

// const app = express();
// app.use(express.json());

// app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));



// import routerEndereco from './ana/rotas/endereco.js';
// import routerFuncionario from './ana/rotas/funcionarios.js';
// import routerFrequencia from './maria/rotas/frequencia.js';
// import routerFormacao from './maria/rotas/rotAformacao.js';
// import routerMarca from './anne/rotas/marca.js';
// import routerCliente from './sofia/rotas/cliente.js';
// import routerEquipamentos from './anne/rotas/equipamento.js';
// import routerExercicios from './luz/rotas/exercicios.js';

// app.use('/funcionarios', routerFuncionario)
// app.use('/endereco', routerEndereco)
// app.use('/frequencia', routerFrequencia)
// app.use('/formacao', routerFormacao)
// app.use('/marca', routerMarca)
// app.use('/cliente', routerCliente)
// app.use('/equipamentos', routerEquipamentos)
// app.use('/exercicios', routerExercicios)

// app.listen(9000, () => {
//     const data = new Date();
//     console.log("Servidor  rodando em: " + data);
// });


import express from 'express';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import cors from 'cors';

const app = express();

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:9000',
    'https://almsfit.dev.vilhena.ifro.edu.br'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); // Permite
        } else {
            callback(new Error('Not allowed by CORS')); // Bloqueia
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));



app.use(express.json());


const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(express.urlencoded({ extended: true }));


import routerEndereco from './ana/rotas/endereco.js';
import routerFuncionario from './ana/rotas/funcionarios.js';
import routerFrequencia from './maria/rotas/frequencia.js';
import routerFormacao from './maria/rotas/rotAformacao.js';
import routerMarca from './anne/rotas/marca.js';
import routerCliente from './sofia/rotas/cliente.js';
import routerEquipamentos from './anne/rotas/equipamento.js';
import routerExercicios from './luz/rotas/exercicios.js';
import authRoutesClientes from './auth/rota/authClientes.js';
import authRoutesFuncionarios from './auth/rota/authFuncionario.js';


app.use('/funcionarios', routerFuncionario);
app.use('/endereco', routerEndereco);
app.use('/frequencia', routerFrequencia);
app.use('/formacao', routerFormacao);
app.use('/marca', routerMarca);
console.log('routerCliente importado');
app.use('/cliente', routerCliente);
app.use('/equipamentos', routerEquipamentos);
app.use('/exercicios', routerExercicios);
app.use('/auth/cliente', authRoutesClientes)
app.use('/auth/funcionario', authRoutesFuncionarios)


app.listen(9000, () => {
    const data = new Date();
    console.log("🚀 Servidor rodando em: http://localhost:9000 - " + data);
});