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

             navigator.serviceWorker.register('Teste.github.io/pwabuilder-sw.js');

       });

}
