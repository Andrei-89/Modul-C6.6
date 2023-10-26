const EchoServerUrl = "wss://echo-ws-service.herokuapp.com";

const statusNode = document.querySelector('.status');
const inputNode = document.querySelector('.inputMsg');
const btnSendNode = document.querySelector('.btnSend');
const btnGeoNode = document.querySelector('.btnGeo');
const resultNode = document.querySelector('.result');


let status = false;
let websocket;
let msgGeolocation;

function openWebsocket() {
  websocket = new WebSocket(EchoServerUrl);
  websocket.onopen = function(e) {
    console.log("CONNECTED");
    status = true;
    statusNode.innerHTML = `<p class="status">Статус подключения: <span style="color: green; font-weight: 600;">CONNECTED</span></p>`;
  };
   websocket.onclose = function(e) {
    console.log("DISCONNECTED");
    status = false;
    statusNode.innerHTML = `<p class="status">Статус подключения: <span style="color: red; font-weight: 600;">DISCONNECTED</span></p>`;
  };
  websocket.onmessage = function(e) {
    if (e.data !== msgGeolocation) {

      writeToScreen(`<span  
                          style="display: block; width: 45%; \
                          text-align: left; border: solid; \
                          border-color:  #631bff; border-radius: 0.4rem;;">` + e.data + '</span>');
    } 
  };
    
  websocket.onerror = function(e) {
    console.log('ERROR: ' + e.data);
  };
};

function writeToScreen(message) {
  let msg = document.createElement("p");
  msg.style.wordWrap = "break-word";
  msg.style.display = "block";
  msg.innerHTML = message;
  resultNode.appendChild(msg);
}

window.addEventListener('beforeunload', () => {
  if (status = true) {
    websocket.close();
  }
  websocket = null;
});

btnGeoNode.addEventListener('click', () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      const {coords:c} = position;
      
      msgGeolocation = `Широта: ${c.latitude}, Долгота: ${c.longitude}`
      let mapLink = `https://www.openstreetmap.org/#map=18/${c.latitude}/${c.longitude}`
      
      writeToScreen(`<span  
                          style="color: black; display: block; text-align: right; \
                          border: solid; width: 45%; margin-left: 270px; \
                          border-color:  #631bff; border-radius: 0.4rem;">` + msgGeolocation + 
                          `<br><a href="${mapLink}" target="_blank">Открыть на карте</a></span>`)
      
      websocket.send(msgGeolocation);
    });
  }
});


btnSendNode.addEventListener('click', () => {
  let valueInputMsg = document.querySelector('.inputMsg').value;
  if (valueInputMsg!=='') {
    
    writeToScreen(`<span  
                          style="color: black; display: block; text-align: right; \
                          border: solid; width: 45%; margin-left: 270px; \
                          border-color:  #631bff; border-radius: 0.4rem;;">` + valueInputMsg + '</span>');
    websocket.send(valueInputMsg);

  } else {
    alert(`Введите текст сообщения!`);
  }
  
});


openWebsocket()