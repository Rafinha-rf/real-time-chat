const http = require('http');
const express = require('express');
const aplicacao = express();

const servidorHttp = http.createServer(aplicacao);
const io = require('socket.io')(servidorHttp);

const usuarios = {};

io.on('connection', (socket) => {
    console.log('Um usuário conectou');

    socket.on('set username', (newUsername, callback) => {
        if (!usuarios[newUsername]) {
            socket.username = newUsername;
            usuarios[newUsername] = true;
            callback({ success: true });
        } else {
            callback({ success: false, message: 'Nome de usuário já em uso. Escolha outro.' });
        }
    });

    socket.on('nova mensagem', (data) => {
        io.emit('nova mensagem', { username: socket.username, mensagem: data.mensagem });
    });
});

aplicacao.use(express.static('public'));

port = 8080;

servidorHttp.listen(port);

console.log(`aplicação rodando na porta ${port}`);