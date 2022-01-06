import express from "express";
import expressWebSocket from "express-ws";
// import expressBodyParser from "body-parser";
import cors from "cors";
import genId from "genid";
import Connection from "./src/Client.js";
import Client from "./src/Client.js";
import Room from "./src/Room.js";

const app = express();

expressWebSocket(app);
app.use(cors());
app.use(express.json());

const rooms = [];

app.get("/connect", (req, res) => {
    let id = genId();

    res.send({
        id,
        wsEndpoint: "/client/" + id,
    });
});

app.ws("/client/:clientId", connection => {
    let client = new Client(connection);
    let availableRoom = rooms.find(room => room.hasRoom());

    if (availableRoom) {
        availableRoom.setClient2(client);
    } else {
        let room = new Room();
        rooms.push(room);

        room.setClient1(client);
    }
});

// app.post("/offer/:token", (req, res) => {
//     let sessionToken = req.body.sessionToken;
//
//     let connection = store[sessionToken] = new Connection(sessionToken);
//     connection.setOffer(req.body);
//
//     res.json({
//         sessionToken,
//     });
// });
//
// app.post("/offer/:token/candidate", (req, res) => {
//     store[req.params.token].addOfferCandidate(req.body);
//
//     res.status(202);
//     res.send();
// });
//
// app.get("/accept/:token", (req, res) => {
//     res.json(store[req.params.token].offer);
//
//     res.status(202);
//     res.send();
// });
//
// app.post("/qwefeqwf/:token/session", (req, res) => {
//     store[req.params.token].setAnswer(req.body);
//
//     res.status(202);
//     res.send();
// });
//
// app.ws("/offer/:token/ws", (socket, req) => {
//     store[req.params.token].connectOfferSocket(socket);
// });

app.listen(process.env.PORT);