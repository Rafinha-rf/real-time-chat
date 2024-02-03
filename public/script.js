const socket = io();
let username = '';


function exibirModalUsuario() {
    Swal.fire({
        title: 'Informe seu nome de usuário',
        input: 'text',
        inputLabel: 'Nome de usuário',
        inputPlaceholder: 'Digite seu nome de usuário',
        showCancelButton: false,
        allowOutsideClick: false,
        confirmButtonText: 'Criar Usuário'
    }).then((result) => {
        if (result.isConfirmed) {
            const novoUsername = result.value.trim();
            if (novoUsername !== "") {
              
                socket.emit('set username', novoUsername, (response) => {
                    if (response.success) {
                        username = novoUsername;
                    } else {
                        alert(response.message);
                        exibirModalUsuario();
                    }
                });
            } else {
                exibirModalUsuario();
            }
        }
    });
}

window.addEventListener('load', exibirModalUsuario);

const botaoEnviar = document.getElementById('enviar');
const caixaMensagem = document.getElementById('texto');
const chat = document.getElementById('mensagens');

botaoEnviar.addEventListener('click', () => {
    enviarMensagem();
});

caixaMensagem.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        enviarMensagem();
    }
});

function enviarMensagem() {
    if (caixaMensagem.value.trim() !== "" && username !== "") {
        socket.emit('nova mensagem', { username, mensagem: caixaMensagem.value });
        caixaMensagem.value = "";
    }
}

socket.on('nova mensagem', (data) => {
    const elementoMensagem = document.createElement('li');
    elementoMensagem.textContent = `${data.username}: ${data.mensagem}`;
    elementoMensagem.classList.add('mensagem');
    chat.appendChild(elementoMensagem);
});
