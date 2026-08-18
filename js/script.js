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
        // ACESSAR O MICROFONE
        // ==========================================

        stream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });


        // ==========================================
        // CRIAR O MEDIA RECORDER
        // ==========================================

        /*
            Não vamos definir manualmente o formato.

            O navegador escolhe o formato que ele
            consegue gravar corretamente.

            No Safari/iPhone, isso evita forçar
            um formato que pode causar erro.
        */

        mediaRecorder = new MediaRecorder(stream);


        console.log(
            'Formato escolhido pelo navegador:',
            mediaRecorder.mimeType
        );


        // ==========================================
        // LIMPAR GRAVAÇÃO ANTERIOR
        // ==========================================

        audioChunks = [];


        // ==========================================
        // RECEBER ÁUDIO
        // ==========================================

        mediaRecorder.addEventListener(
            'dataavailable',
            (evento) => {

                // Verifica se recebeu dados

                if (
                    evento.data &&
                    evento.data.size > 0
                ) {

                    // Guarda o pedaço do áudio

                    audioChunks.push(evento.data);

                }

            }
        );


        // ==========================================
        // QUANDO A GRAVAÇÃO PARAR
        // ==========================================

        mediaRecorder.addEventListener(
            'stop',
            () => {

                console.log(
                    'Quantidade de pedaços:',
                    audioChunks.length
                );


                // Verifica se recebeu algum áudio

                if (audioChunks.length === 0) {

                    status.innerText =
                        'Status: Nenhum áudio foi gravado.';

                    return;

                }


                // ==========================================
                // CRIAR O ARQUIVO
                // ==========================================

                /*
                    Usa exatamente o formato que o
                    MediaRecorder informou.
                */

                const tipoAudio =
                    mediaRecorder.mimeType;


                console.log(
                    'Tipo do áudio:',
                    tipoAudio
                );


                // Junta os pedaços

                const audioBlob = new Blob(
                    audioChunks,
                    {
                        type: tipoAudio
                    }
                );


                console.log(
                    'Tamanho do áudio:',
                    audioBlob.size
                );


                // Verifica se o arquivo está vazio

                if (audioBlob.size === 0) {

                    status.innerText =
                        'Status: O áudio ficou vazio.';

                    return;

                }


                // ==========================================
                // CRIAR URL
                // ==========================================

                const audioUrl =
                    URL.createObjectURL(audioBlob);


                console.log(
                    'URL criada:',
                    audioUrl
                );


                // ==========================================
                // COLOCAR NO PLAYER
                // ==========================================

                audioPlayer.src = audioUrl;


                // Recarrega o player

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
                // STATUS
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
        // COMEÇAR A GRAVAÇÃO
        // ==========================================

        /*
            IMPORTANTE:

            Não usamos:

                mediaRecorder.start(100)

            porque isso divide o áudio em vários
            pedaços muito pequenos.

            Vamos deixar o navegador criar
            uma gravação única.
        */

        mediaRecorder.start();


        // Indica que começou

        gravando = true;


        // ==========================================
        // VISUAL DO BOTÃO
        // ==========================================

        btn.classList.add('gravando');


        btn.style.backgroundColor =
            '#e74c3c';


        btn.innerText =
            '🔴 Gravando... Não solte!';


        // ==========================================
        // STATUS
        // ==========================================

        status.innerText =
            'Status: Capturando áudio...';

    }


    catch (erro) {

        console.error(
            'Erro ao acessar o microfone:',
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
            'Erro no player:',
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

    // Verifica se existe gravador

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

btn.addEventListener(
    'mousedown',
    (evento) => {

        evento.preventDefault();

        iniciarGravacao();

    }
);


btn.addEventListener(
    'mouseup',
    () => {

        if (gravando) {

            pararGravacao();

        }

    }
);


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

btn.addEventListener(
    'touchstart',
    (evento) => {

        evento.preventDefault();


        if (!gravando) {

            iniciarGravacao();

        }

    },
    {
        passive: false
    }
);


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
