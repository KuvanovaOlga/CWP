const net = require('net');
const fs = require("fs");

const saveDirectory = process.env.NODE_PATH;
const maxConnection = process.env.CONST_MAX_CONNECTION;
const port = 8124;
let json_q = [];
let seed = 0;
const dec = "DEC";
const ack= "ACK";
const qa = "QA";
const unknown = "UNKNOWN";
const dir = "Direct";
const client_name = "Client";
const server_name = "Server";
const files = "FILES";
let clientModes = [];
let file = [];
let separator = "\t\v\t\r";

const server = net.createServer((client) => {
    client.setEncoding('utf8');

    client.on('data', (data) => {
        if(data.toString() === dec)
        {
            console.log('Disabling the server with DEC');
            client.write(dec);
            client.end;
        }
        client.on('data', ClientHandler);
        client.on('data', ClientFilesDialogue);
        client('end', () => console.log(`Client ${client.id} disconnected`));
    });

});

function ClientHandler(data, error) {
    if (!error) {
        console.log("client handler")
        if (client.id === undefined && (data.toString() === files)) {
            client.id = Date.now().toString() + seed++;
            console.log(`Client ${client.id} connect`);
            clientModes[client.id] = data.toString();
            file[client.id] = [];
            fs.mkdirSync(saveDirectory + path.sep + client.id);
            client.write(ack);
        }
    }
    else {
        console.error("ClientHandler error : " + error);
        client.write(dec);
    }
}
function ClientFilesDialogue(data, error) {
    if (!error) {
        if (clientModes[client.id] === files && data.toString() !== "FILES") {
            file[client.id].push(data);
            if (data.toString().endsWith(separator + "FIN")) {
                CreateFile(saveDirectory + path.sep + client.id, client.id);
                client.write(accept);
            }
        }
    }
    else console.error("ClientFilesDialogue error : " + error);

}

server.maxConnections = maxConnection;

server.listen(port, () => {
    console.log(`Server listening on localhost:${port}`);
});

function CreateFile(saveDir, id) {
    console.log("createfile");
    let buffer = Buffer.concat(file[id]);
    let separatorIndex = buffer.indexOf(separator);
    let filename = buffer.slice(separatorIndex).toString().split(separator).filter(Boolean)[0];
    fs.writeFileSync(saveDir + path.sep + filename, buffer.slice(0, separatorIndex));
    file[id] = [];
}