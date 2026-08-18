// ==========================================
// ELEMENTOS DO HTML
// ==========================================

const btn = document.getElementById('btn-gravador');

const status = document.getElementById('status-gravacao');

const audioPlayer = document.getElementById('player-audio');

const areaAudio = document.querySelector('.area-audio');


// ==========================================
// VARIÁVEIS
// ==========================================

let mediaRecorder = null;

let audioChunks = [];

let gravando = false;

let stream = null;


// ==========================================
// INICIAR GRAVAÇÃO
// ==========================================

async function iniciarGravacao() {

    // Evita iniciar duas gravações ao mesmo tempo

    if (gravando) {
        return;
    }


    try {

        // Pede acesso ao microfone

        stream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });


        // Verifica qual formato o navegador suporta

        let tipoAudio = '';


        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {

            tipoAudio = 'audio/webm;codecs=opus';

        } else if (MediaRecorder.isTypeSupported('audio/webm')) {

            tipoAudio = 'audio/webm';

        } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {

            tipoAudio = 'audio/ogg;codecs=opus';

        }


        // Cria o MediaRecorder

        if (tipoAudio) {

            mediaRecorder = new MediaRecorder(stream, {
                mimeType: tipoAudio
            });

        } else {

            mediaRecorder = new MediaRecorder(stream);

        }


        console.log('Formato utilizado:', mediaRecorder.mimeType);


        // Limpa gravação anterior

        audioChunks = [];


        // ==========================================
        // RECEBER PEDAÇOS DO ÁUDIO
        // ==========================================

        mediaRecorder.addEventListener('dataavailable', (evento) => {

            if (evento.data && evento.data.size > 0) {

                audioChunks.push(evento.data);

            }

        });


        // ==========================================
        // QUANDO PARAR A GRAVAÇÃO
        // ==========================================

        mediaRecorder.addEventListener('stop', () => {

            console.log('Pedaços de áudio:', audioChunks.length);


            // Verifica se realmente temos áudio

            if (audioChunks.length === 0) {

                status.innerText =
                    'Status: Nenhum áudio foi gravado.';

                return;

            }


            // Pega o formato utilizado pelo gravador

            const tipoBlob = mediaRecorder.mimeType || 'audio/webm';


            // Junta todos os pedaços

            const audioBlob = new Blob(audioChunks, {
                type: tipoBlob
            });


            console.log('Tamanho do áudio:', audioBlob.size);


            // Verifica se o arquivo não está vazio

            if (audioBlob.size === 0) {

                status.innerText =
                    'Status: O áudio ficou vazio.';

                return;

            }


            // Cria uma URL para o áudio

            const audioUrl = URL.createObjectURL(audioBlob);


            // Coloca o áudio no player

            audioPlayer.src = audioUrl;

            audioPlayer.load();


            // Mostra o player

            audioPlayer.style.display = 'block';


            if (areaAudio) {

                areaAudio.classList.add('mostrar');

            }


            // Atualiza o status

            status.innerText =
                'Status: Gravação concluída!';


            // Libera o microfone

            if (stream) {

                stream.getTracks().forEach((track) => {

                    track.stop();

                });

            }


            // Limpa os pedaços

            audioChunks = [];

        });


        // ==========================================
        // COMEÇAR
        // ==========================================

        mediaRecorder.start(100);


        gravando = true;


        // Visual do botão

        btn.classList.add('gravando');

        btn.style.backgroundColor = '#e74c3c';


        btn.innerText =
            '🔴 Gravando... Não solte!';


        // Status

        status.innerText =
            'Status: Capturando áudio...';

    }


    catch (erro) {

        console.error('Erro ao iniciar gravação:', erro);


        status.innerText =
            'Status: Não foi possível acessar o microfone.';


        gravando = false;

    }

}



// ==========================================
// PARAR GRAVAÇÃO
// ==========================================

function pararGravacao() {

    if (!mediaRecorder) {
        return;
    }


    if (mediaRecorder.state === 'recording') {

        mediaRecorder.stop();

    }


    gravando = false;


    // Remove efeito do botão

    btn.classList.remove('gravando');


    btn.style.backgroundColor = '';


    btn.innerText =
        '🎤 Segure para Gravar';

}



// ==========================================
// MOUSE
// ==========================================

btn.addEventListener('mousedown', (evento) => {

    evento.preventDefault();

    iniciarGravacao();

});


btn.addEventListener('mouseup', () => {

    if (gravando) {

        pararGravacao();

    }

});


btn.addEventListener('mouseleave', () => {

    if (gravando) {

        pararGravacao();

    }

});



// ==========================================
// CELULAR
// ==========================================

btn.addEventListener('touchstart', (evento) => {

    evento.preventDefault();

    if (!gravando) {

        iniciarGravacao();

    }

}, {
    passive: false
});


btn.addEventListener('touchend', (evento) => {

    evento.preventDefault();

    if (gravando) {

        pararGravacao();

    }

}, {
    passive: false
});


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
        )
        .catch((erro) => {

            console.error(
                'Erro ao registrar Service Worker:',
                erro
            );

        });

    });

}
