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

        // ==========================================
        // PEDIR ACESSO AO MICROFONE
        // ==========================================

        stream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });


        // ==========================================
        // VERIFICAR FORMATO COMPATÍVEL
        // ==========================================

        let tipoAudio = '';


        // Primeiro tenta MP4/AAC.
        // É o formato preferido para Safari e iPhone.

        if (
            MediaRecorder.isTypeSupported(
                'audio/mp4;codecs=mp4a.40.2'
            )
        ) {

            tipoAudio = 'audio/mp4;codecs=mp4a.40.2';

        }


        // Tenta MP4 sem especificar o codec

        else if (
            MediaRecorder.isTypeSupported('audio/mp4')
        ) {

            tipoAudio = 'audio/mp4';

        }


        // Se não suportar MP4, tenta WebM com Opus

        else if (
            MediaRecorder.isTypeSupported(
                'audio/webm;codecs=opus'
            )
        ) {

            tipoAudio = 'audio/webm;codecs=opus';

        }


        // Tenta WebM simples

        else if (
            MediaRecorder.isTypeSupported('audio/webm')
        ) {

            tipoAudio = 'audio/webm';

        }


        // Tenta OGG como última alternativa

        else if (
            MediaRecorder.isTypeSupported(
                'audio/ogg;codecs=opus'
            )
        ) {

            tipoAudio = 'audio/ogg;codecs=opus';

        }


        // Mostra no console qual formato foi escolhido

        console.log(
            'Formato escolhido:',
            tipoAudio || 'padrão do navegador'
        );


        // ==========================================
        // CRIAR MEDIARECORDER
        // ==========================================

        if (tipoAudio) {

            mediaRecorder = new MediaRecorder(stream, {
                mimeType: tipoAudio
            });

        } else {

            // Caso o navegador não informe um formato,
            // deixa ele escolher automaticamente.

            mediaRecorder = new MediaRecorder(stream);

        }


        console.log(
            'Formato real utilizado:',
            mediaRecorder.mimeType
        );


        // ==========================================
        // LIMPAR GRAVAÇÃO ANTERIOR
        // ==========================================

        audioChunks = [];


        // ==========================================
        // RECEBER PEDAÇOS DO ÁUDIO
        // ==========================================

        mediaRecorder.addEventListener(
            'dataavailable',
            (evento) => {

                // Verifica se recebeu algum áudio

                if (
                    evento.data &&
                    evento.data.size > 0
                ) {

                    // Guarda o pedaço recebido

                    audioChunks.push(evento.data);

                }

            }
        );


        // ==========================================
        // QUANDO PARAR A GRAVAÇÃO
        // ==========================================

        mediaRecorder.addEventListener(
            'stop',
            () => {

                console.log(
                    'Pedaços de áudio:',
                    audioChunks.length
                );


                // Verifica se recebeu algum áudio

                if (audioChunks.length === 0) {

                    status.innerText =
                        'Status: Nenhum áudio foi gravado.';

                    return;

                }


                // ==========================================
                // CRIAR O ARQUIVO DE ÁUDIO
                // ==========================================

                // Usa exatamente o formato que o
                // MediaRecorder utilizou.

                const tipoBlob =
                    mediaRecorder.mimeType;


                console.log(
                    'Tipo do Blob:',
                    tipoBlob
                );


                // Junta todos os pedaços

                const audioBlob = new Blob(
                    audioChunks,
                    {
                        type: tipoBlob
                    }
                );


                console.log(
                    'Tamanho do áudio:',
                    audioBlob.size
                );


                // Verifica se o arquivo não está vazio

                if (audioBlob.size === 0) {

                    status.innerText =
                        'Status: O áudio ficou vazio.';

                    return;

                }


                // ==========================================
                // CRIAR URL DO ÁUDIO
                // ==========================================

                const audioUrl =
                    URL.createObjectURL(audioBlob);


                console.log(
                    'URL do áudio criada:',
                    audioUrl
                );


                // ==========================================
                // COLOCAR ÁUDIO NO PLAYER
                // ==========================================

                audioPlayer.src = audioUrl;

                audioPlayer.type = tipoBlob;

                audioPlayer.load();


                // ==========================================
                // MOSTRAR PLAYER
                // ==========================================

                audioPlayer.style.display =
                    'block';


                if (areaAudio) {

                    areaAudio.classList.add(
                        'mostrar'
                    );

                }


                // ==========================================
                // ATUALIZAR STATUS
                // ==========================================

                status.innerText =
                    'Status: Gravação concluída!';


                // ==========================================
                // LIBERAR MICROFONE
                // ==========================================

                if (stream) {

                    stream
                        .getTracks()
                        .forEach((track) => {

                            track.stop();

                        });

                }


                // Limpa os pedaços

                audioChunks = [];

            }
        );


        // ==========================================
        // COMEÇAR GRAVAÇÃO
        // ==========================================

        // O intervalo de 100ms faz o navegador
        // entregar pequenos pedaços do áudio.

        mediaRecorder.start(100);


        // Indica que está gravando

        gravando = true;


        // ==========================================
        // ALTERAR VISUAL DO BOTÃO
        // ==========================================

        btn.classList.add('gravando');


        btn.style.backgroundColor =
            '#e74c3c';


        btn.innerText =
            '🔴 Gravando... Não solte!';


        // ==========================================
        // ALTERAR STATUS
        // ==========================================

        status.innerText =
            'Status: Capturando áudio...';

    }


    catch (erro) {

        console.error(
            'Erro ao iniciar gravação:',
            erro
        );


        status.innerText =
            'Status: Não foi possível acessar o microfone.';


        gravando = false;

    }

}



// ==========================================
// ERRO DO PLAYER
// ==========================================

audioPlayer.addEventListener(
    'error',
    () => {

        console.error(
            'Erro ao reproduzir o áudio:',
            audioPlayer.error
        );


        status.innerText =
            'Status: Erro ao reproduzir o áudio.';

    }
);



// ==========================================
// PARAR GRAVAÇÃO
// ==========================================

function pararGravacao() {

    // Verifica se existe um MediaRecorder

    if (!mediaRecorder) {
        return;
    }


    // Verifica se está gravando

    if (
        mediaRecorder.state === 'recording'
    ) {

        // Para a gravação

        mediaRecorder.stop();

    }


    // Atualiza variável

    gravando = false;


    // ==========================================
    // RESTAURAR BOTÃO
    // ==========================================

    btn.classList.remove('gravando');


    btn.style.backgroundColor = '';


    btn.innerText =
        '🎤 Segure para Gravar';

}



// ==========================================
// MOUSE
// ==========================================


// Quando o mouse pressionar o botão

btn.addEventListener(
    'mousedown',
    (evento) => {

        evento.preventDefault();


        iniciarGravacao();

    }
);



// Quando o mouse soltar o botão

btn.addEventListener(
    'mouseup',
    () => {

        if (gravando) {

            pararGravacao();

        }

    }
);



// Se o mouse sair do botão enquanto
// estiver pressionado

btn.addEventListener(
    'mouseleave',
    () => {

        if (gravando) {

            pararGravacao();

        }

    }
);



// ==========================================
// CELULAR / TOUCH
// ==========================================


// Quando o usuário coloca o dedo no botão

btn.addEventListener(
    'touchstart',
    (evento) => {

        // Impede comportamento padrão

        evento.preventDefault();


        // Evita iniciar duas vezes

        if (!gravando) {

            iniciarGravacao();

        }

    },
    {
        passive: false
    }
);



// Quando o usuário tira o dedo

btn.addEventListener(
    'touchend',
    (evento) => {

        evento.preventDefault();


        if (gravando) {

            pararGravacao();

        }

    },
    {
        passive: false
    }
);



// Se o toque for cancelado

btn.addEventListener(
    'touchcancel',
    () => {

        if (gravando) {

            pararGravacao();

        }

    }
);



// ==========================================
// SERVICE WORKER
// ==========================================

if ('serviceWorker' in navigator) {

    window.addEventListener(
        'load',
        () => {

            navigator.serviceWorker
                .register(
                    '/Teste.github.io/pwabuilder-sw.js'
                )
                .catch(
                    (erro) => {

                        console.error(
                            'Erro ao registrar Service Worker:',
                            erro
                        );

                    }
                );

        }
    );

}
