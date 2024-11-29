// Configuração da API do Google
const CLIENT_ID = 'SEU_CLIENT_ID';
const API_KEY = 'SUA_API_KEY';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

// Carrega a API do Google Calendar
function loadGoogleAPI() {
    gapi.load('client:auth2', initClient);
}

// Inicializa o cliente da API do Google
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
    }).then(function () {
        // Verifica o status da autenticação
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}

// Atualiza o status de autenticação
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        listUpcomingEvents(); // Se estiver autenticado, mostra os eventos
    } else {
        handleAuthClick(); // Se não estiver autenticado, chama a função de login
    }
}

// Inicia o processo de login
function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}

// Desloga
function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
}

// Lista os próximos eventos no Google Calendar
function listUpcomingEvents() {
    gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    }).then(function (response) {
        const events = response.result.items;
        if (events.length > 0) {
            let eventsHtml = '<ul>';
            events.forEach(function (event) {
                const start = event.start.dateTime || event.start.date;
                eventsHtml += `<li>${event.summary} (${start})</li>`;
            });
            eventsHtml += '</ul>';
            document.getElementById('events').innerHTML = eventsHtml;
        } else {
            document.getElementById('events').innerHTML = 'Nenhum evento encontrado.';
        }
    });
}

// Carregar o script da API do Google
function loadScript() {
    const script = document.createElement('script');
    script.src = "https://apis.google.com/js/api.js?onload=loadGoogleAPI";
    document.body.appendChild(script);
}

// Executar quando o documento estiver pronto
document.addEventListener("DOMContentLoaded", function () {
    loadScript();
});
