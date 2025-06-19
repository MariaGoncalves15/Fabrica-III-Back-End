import express from "express";
import jwt from "jsonwebtoken";
import pool from "../../conexao.js";

const authRoutesClientes = express.Router();

authRoutesClientes.post("/login", async (req, res) => {
  // #swagger.tags = ['Autenticação - Cliente']
  // #swagger.description = 'Realiza o login do cliente e retorna cookies com token e dados do usuário.'
  /* #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: 'object',
              properties: {
                email: { type: 'string', example: 'cliente@email.com' },
                senha: { type: 'string', example: '123456' }
              },
              required: ['email', 'senha']
            }
          }
        }
    }
  */
  /* #swagger.responses[200] = {
        description: 'Login realizado com sucesso.',
        schema: { message: 'Login realizado com sucesso' }
  } */
  /* #swagger.responses[401] = {
        description: 'Usuário ou senha incorretos.',
        schema: { error: 'Usuário ou senha incorretos.' }
  } */
  /* #swagger.responses[500] = {
        description: 'Erro no servidor durante o login.',
        schema: { error: 'Erro no servidor' }
  } */
  try {
    const { email, senha } = req.body;

    const [results] = await pool.query("SELECT * FROM clientes WHERE email = ?", [email]);

    if (results.length === 0) {
      return res.status(401).json({ error: "Usuário ou senha incorretos." });
    }

    const usuario = results[0];

    const senhaValida = await senha === usuario.senha ? true : false;
    if (!senhaValida) {
      return res.status(401).json({ error: "Usuário ou senha incorretos." });
    }

    const token = jwt.sign(
      { id: usuario.idclientes, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400000,
      sameSite: "Strict"
    });

    res.cookie("id", usuario.idclientes, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "Strict",
      maxAge: 86400000,
    });

    res.cookie("userType", 'Cliente', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "Strict",
      maxAge: 86400000,
    });

    res.json({ message: "Login realizado com sucesso" });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

authRoutesClientes.post("/logout", (req, res) => {
  // #swagger.tags = ['Autenticação - Cliente']
  // #swagger.description = 'Realiza o logout do cliente, removendo os cookies de autenticação.'
  /* #swagger.responses[200] = {
        description: 'Logout realizado com sucesso.',
        schema: { message: 'Logout realizado com sucesso.' }
  } */
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "lax"
  });
  res.clearCookie("id", {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "lax"
  });
  res.clearCookie("userType", {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "lax"
  });

  res.json({ message: "Logout realizado com sucesso." });
});

export default authRoutesClientes;
