const { render } = require("ejs");
const express = require("express");

const { Server: HttpServer } = require("http");
const { Server: Socket } = require("socket.io");

const ContenedorArchivo = require("../contenedores/ContenedorArchivo.js");

//--------------------------------------------
// instancio servidor, socket y api

const app = express();
const httpServer = new HttpServer(app);
const io = new Socket(httpServer);

const mensajesApi = new ContenedorArchivo("mensajes.json");

//configuramos EJS
app.set("view engine", "ejs");

//--------------------------------------------
// configuro el socket

io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado!");

  // carga inicial de mensajes
  socket.emit("mensajes", await mensajesApi.listarAll());

  // actualizacion de mensajes
  socket.on("nuevoMensaje", async (mensaje) => {
    mensaje.fyh = new Date().toLocaleString();
    await mensajesApi.guardar(mensaje);
    io.sockets.emit("mensajes", await mensajesApi.listarAll());
  });
});

//--------------------------------------------
// agrego middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  res.render("index", {
    mensajes: await mensajesApi.listarAll(),
  });
});
//--------------------------------------------
// inicio el servidor

const PORT = 8080;
const connectedServer = httpServer.listen(PORT, () => {
  console.log(
    `Servidor http escuchando en el puerto ${connectedServer.address().port}`
  );
});
connectedServer.on("error", (error) =>
  console.log(`Error en servidor ${error}`)
);
