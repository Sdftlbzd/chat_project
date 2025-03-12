import express from "express";
import "reflect-metadata";
import http from "http";
import { Server } from "socket.io";
import { AppDataSource } from "./DAL/config/data-source";
import { appConfig } from "./consts";
import { v1Routes } from "./Routes";

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");

    const app = express();
    const port = appConfig.PORT;

    app.use(express.json());
    app.use("/api/v1", v1Routes);

    app.get("/", (req, res) => {
      res.send("<h1>Hello world !!!</h1>");
    });

    // create http server
    const server = http.createServer(app);

    // create web socket server
    const socketIO = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    socketIO.on("connection", (socket) => {
      console.log("A user connected", socket.id);

      socket.on("type", (username) => {
        socket.broadcast.emit("typing-user", username);

        console.log(`${username} is typing...`);
      });

      socket.on("chat", ({ username, message }) => {
        console.log(`[${username}]: ${message}`);

        socketIO.emit("receive-message", { username, message });
      });

      socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
      });
    });

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to database", error);
  });
