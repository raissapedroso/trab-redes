const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

const db = new sqlite3.Database('./database.db');


db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario TEXT,
            senha TEXT
        )
    `);

    // usuário de teste
    db.run(`
        INSERT INTO usuarios (usuario, senha)
        VALUES ('admin', '123456')
    `);
});


app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static('public'));


app.post('/login', (req, res) => {

    const { usuario, senha } = req.body;

    db.get(
        `SELECT * FROM usuarios
         WHERE usuario = ? AND senha = ?`,
        [usuario, senha],

        (err, row) => {

            if (row) {

                res.send('Login realizado com sucesso!');

            } else {

                res.send('Usuário ou senha inválidos');

            }
        }
    );
});

// iniciando o servidor
app.listen(PORT, () => {

    console.log(`Servidor rodando em http://localhost:${PORT}`);

});