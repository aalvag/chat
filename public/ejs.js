const socket = io.connect();
const form = document.getElementById("form");
const inputUsername = document.getElementById("inputUsername");
const inputMensaje = document.getElementById("inputMensaje");
const btnEnviar = document.getElementById("btnEnviar");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const mensaje = {
    autor: inputUsername.value,
    texto: inputMensaje.value,
  };
  socket.emit("nuevoMensaje", mensaje);
  inputMensaje.value = "";
});

socket.on("mensajes", (mensajes) => {
  const mensajesHTML = mensajes
    .map(
      (mensaje) =>
        `<div>
              <b style="color: blue">${mensaje.autor}</b>
              <span style="color: brown">${mensaje.fyh}</span>
              <i style="color: green">${mensaje.texto}</i>
            </div>`
    )
    .join(" ");
  document.getElementById("mensajes").innerHTML = mensajesHTML;
});
