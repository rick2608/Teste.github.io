// as const btn e status são variáveis constantes

const btn = document.getElementById('btn-gravador');

const status = document.getElementById('status-gravacao');


// Pega o elemento <audio> do HTML pelo ID "player-audio"
// Esse elemento será usado para reproduzir o áudio gravado.

const audioPlayer = document.getElementById('player-audio');


// Pega a área onde o player de áudio está

const areaAudio = document.querySelector('.area-audio');


// Cria uma lista vazia para armazenar os pedaços do áudio.
// Durante a gravação, o navegador vai entregar o áudio em pequenos pedaços.

let audioChunks = [];


// Variável que vai guardar o MediaRecorder

let mediaRecorder;


// Variável para saber se estamos gravando

let gravando = false;



// ==========================================
// INICIAR GRAVAÇÃO
// ==========================================

async function iniciarGravacao() {

    // Verifica se já está gravando

    if (gravando) {
        return;
    }


    try {

        // Pede permissão para usar o microfone

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });


        // Cria o MediaRecorder usando o microfone

        mediaRecorder = new MediaRecorder(stream);


        // Limpa os pedaços de uma gravação anterior

        audioChunks = [];


        // Quando o MediaRecorder tiver um pedaço
        // de áudio disponível, esse evento será executado

        mediaRecorder.ondataavailable = (evento) => {

            // Verifica se realmente recebeu algum áudio

            if (evento.data.size > 0) {

                // Adiciona o pedaço na lista

                audioChunks.push(evento.data);

            }

        };


        // Quando a gravação for parada

        mediaRecorder.onstop = () => {

            // Junta todos os pedaços do áudio
            // e cria um único arquivo

            const audioBlob = new Blob(audioChunks, {

                // Define o tipo do arquivo

                type: 'audio/webm'

            });


            // Cria uma URL temporária para o áudio

            const audioUrl = URL.createObjectURL(audioBlob);


            // Coloca o áudio dentro do player

            audioPlayer.src = audioUrl;


            // Mostra o player de áudio

            audioPlayer.style.display = 'block';


            // Se você estiver usando a classe
            // "area-audio", mostra a área também

            if (areaAudio) {

                areaAudio.classList.add('mostrar');

            }


            // Muda o status

            status.innerText = 'Status: Gravação concluída!';


            // Libera o microfone

            stream.getTracks().forEach((track) => {

                track.stop();

            });


            // Limpa os pedaços da gravação

            audioChunks = [];

        };


        // Começa a gravação

        mediaRecorder.start();


        // Indica que estamos gravando

        gravando = true;


        // Muda a cor do botão

        btn.style.backgroundColor = '#e74c3c';


        // Muda o texto do botão

        btn.innerText = '🔴 Gravando... Não solte!';


        // Muda o texto do status

        status.innerText = 'Status: Capturando áudio...';

    }

    catch (erro) {

        // Mostra o erro no console

        console.error('Erro ao acessar o microfone:', erro);


        // Informa o usuário

        status.innerText = 'Status: Não foi possível acessar o microfone.';

    }

}



// ==========================================
// PARAR GRAVAÇÃO
// ==========================================

function pararGravacao() {

    // Verifica se existe um MediaRecorder

    if (!mediaRecorder) {
        return;
    }


    // Verifica se ele está gravando

    if (mediaRecorder.state === 'recording') {

        // Para a gravação

        mediaRecorder.stop();

    }


    // Informa que não estamos mais gravando

    gravando = false;


    // Restaura a cor do botão

    btn.style.backgroundColor = '#3498db';


    // Restaura o texto do botão

    btn.innerText = '🎤 Clique e Segure para Gravar';

}



// ==========================================
// MOUSE - APERTAR
// ==========================================

// Quando o botão do mouse for pressionado

btn.addEventListener('mousedown', (evento) => {

    evento.preventDefault();

    iniciarGravacao();

});



// ==========================================
// MOUSE - SOLTAR
// ==========================================

// Quando o botão do mouse for solto

btn.addEventListener('mouseup', () => {

    if (gravando) {

        pararGravacao();

    }

});



// Se o mouse sair do botão enquanto estiver segurando,
// também para a gravação

btn.addEventListener('mouseleave', () => {

    if (gravando) {

        pararGravacao();

    }

});



// ==========================================
// CELULAR - TOCAR
// ==========================================

// Evento: quando o usuário coloca o dedo no botão

btn.addEventListener('touchstart', (evento) => {

    // Impede comportamentos indesejados do celular

    evento.preventDefault();


    // Começa a gravação

    iniciarGravacao();

}, {
    passive: false
});



// ==========================================
// CELULAR - SOLTAR
// ==========================================

// Evento: quando o usuário remove o dedo

btn.addEventListener('touchend', (evento) => {

    // Impede comportamentos indesejados

    evento.preventDefault();


    // Para a gravação

    if (gravando) {

        pararGravacao();

    }

}, {
    passive: false
});



// Se o toque for cancelado,
// também para a gravação

btn.addEventListener('touchcancel', () => {

    if (gravando) {

        pararGravacao();

    }

});



// ==========================================
// SERVICE WORKER
// ==========================================

if ('serviceWorker' in navigator) {

    window.addEventListener('load', () => {

        navigator.serviceWorker.register(
            '/Teste.github.io/pwabuilder-sw.js'
        );

    });

}
