// Configura a API do Google
function start() {
    gapi.client.init({
      apiKey: 'YOUR_API_KEY',
      clientId: 'YOUR_CLIENT_ID',
      scope: 'https://www.googleapis.com/auth/calendar.readonly',
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
    }).then(function() {
      // Autentica o usuário
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
  }
  
  // Atualiza o estado de login
  function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      listUpcomingEvents();
    } else {
      document.getElementById('login-button').onclick = handleAuthClick;
    }
  }
  
  // Função para login
  function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
  }
  
  // Função para pegar os eventos
  function listUpcomingEvents() {
    gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'orderBy': 'startTime'
    }).then(function(response) {
      const events = response.result.items;
      let output = '<h2>Próximos eventos:</h2><ul>';
      if (events.length) {
        events.forEach(event => {
          output += `<li>${event.summary} - ${event.start.dateTime || event.start.date}</li>`;
        });
      } else {
        output += 'Nenhum evento encontrado!';
      }
      output += '</ul>';
      document.getElementById('calendar-events').innerHTML = output;
    });
  }
  
  // Carrega a API do Google
  gapi.load('client:auth2', start);
  