const net = require('net');
const fs = require('fs');
const port = 8124;

let id = 0;
let question = [];
const qa = "QA";
const ack = "ACK";
const dec = "DEC";
const unknown = "UNKNOWN";
const dir = "Direct";
const client_name = "Client";
const server_name = "Server";

const client = new net.Socket();

client.setEncoding('utf8');

client.connect(port, function() {
    fs.readFile("qa.json", (err, data) =>
    {
        if(err)
        {
            console.error("Error with json file");
        }
        else
        {
            question = json.parse(data);
            question = shuffle(question);
            client.write(qa);
            console.log("Connected to the server");
        }
    });
    //console.log('Connected');
    //client.write('\r\nHello, Server!\r\nLove,\r\nClient.\r\n');
});

client.on('data', function(data) {
    if(data !== ack) client.write (questions[0].question);
    if(data === dec)
    {
        client.destroy();
        process.terminate();
    }
    if(data !== ack)
    {
        console.log("Question:" + question[id]);
        console.log("Answer:" + data);
        console.log("Is right: " + (data === questions[id].question ? "Yes" : "No"));
        if (id + 1 === questions.length)
        {
            console.log("Questions are over");
            client.destroy();
        }
        else
        {
            ++id;
            client.write(questions[ind].question);
        }

    }
    //console.log(data);
    //client.destroy();
});

client.on('close', function() {
    console.log('Connection closed');
});

function shuffle(array)
{
    let size = array.length;
    while (size > 0)
    {
        let index = Math.floor(Math.random() * size);
        size--;
        let temp = array[size];
        array[size] = array[index];
        array[index] = temp;
    }
    return array;
}