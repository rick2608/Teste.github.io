// as const btn e status são variáveis constantes

const btn = document.getElementById('btn-gravador');

const status = document.getElementById('status-gravacao');



// quando o botão for clicado, ele muda a cor e o texto

btn.addEventListener('mousedown', () => {

    // muda a cor do botão para vermelho e o texto para "Gravando..."

    btn.style.backgroundColor = '#e74c3c';

    // muda o texto do botão para "Gravando... Não solte!" e o status para "Capturando áudio..."

    btn.innerText = '🔴 Gravando... Não solte!';

    // muda o texto do status para "Capturando áudio..."

    status.innerText = 'Status: Capturando áudio...';

});



// quando o botão for solto, ele muda a cor e o texto

btn.addEventListener('mouseup', () => {

    // muda a cor do botão para azul e o texto para "Clique e Segure para Gravar"

    btn.style.backgroundColor = '#3498db';

    // muda o texto do botão para "Clique e Segure para Gravar" e o status para "Gravação concluída e enviada!"

    btn.innerText = '🎤 Clique e Segure para Gravar';

    // muda o texto do status para "Gravação concluída e enviada!"

    status.innerText = 'Status: Gravação concluída e enviada!';

});

// Evento: Quando o usuário coloca o dedo no botão

btn.addEventListener('touchstart', (evento) => {

    // Impede zooms e seleções de texto indesejadas no celular

    evento.preventDefault();



    // Altera a cor e os textos para o modo de gravação

    btn.style.backgroundColor = '#e74c3c';







    btn.innerText = '🔴 Gravando... Não solte!';

    status.innerText = 'Status: Capturando áudio...';

});



// Evento: Quando o usuário remove o dedo do botão

btn.addEventListener('touchend', () => {

    // Restaura o botão e atualiza o status de envio

    btn.style.backgroundColor = '#3498db';

    btn.innerText = '🎤 Clique e Segure para Gravar';

    status.innerText = 'Status: Gravação concluída e enviada!';

});

if ('serviceWorker' in navigator) {

       window.addEventListener('load', () => {

             navigator.serviceWorker.register('/Teste.github.io/pwabuilder-sw.js');

       });

}

// Pega o elemento <audio> do HTML pelo ID "audioPlayer".
// Esse elemento será usado para reproduzir o áudio gravado.
const audioPlayer = document.getElementById("player-audio");


// Cria uma lista vazia para armazenar os pedaços do áudio.
// Durante a gravação, o navegador vai entregar o áudio em pequenos pedaços.
let audioChunks = [];


// O evento "ondataavailable" acontece sempre que o MediaRecorder
// possui um pedaço de áudio disponível.
mediaRecorder.ondataavailable = (evento) => {

    // Adiciona o pedaço de áudio recebido dentro da lista.
    audioChunks.push(evento.data);
};


// O evento "onstop" acontece quando a gravação é parada.
mediaRecorder.onstop = () => {

    // Junta todos os pedaços que estavam dentro de "audioChunks"
    // e transforma tudo em um único arquivo de áudio.
    const audioBlob = new Blob(audioChunks, {
        
        // Define o formato do áudio.
        // "audio/webm" é um formato bastante usado pelo MediaRecorder.
        type: "audio/webm"
    });


    // Cria uma URL temporária para o áudio.
    // Essa URL permite que o elemento <audio> consiga acessar
    // o áudio que acabamos de criar.
    const audioUrl = URL.createObjectURL(audioBlob);


    // Coloca a URL do áudio dentro do player.
    // A partir daqui, o navegador sabe qual áudio deve reproduzir.
    audioPlayer.src = audioUrl;


    // Limpa a lista de pedaços do áudio.
    // Assim podemos fazer uma nova gravação sem misturar
    // o áudio antigo com o novo.
    audioChunks = [];
};
