const net = require('net');
const fs = require('fs');
const path=require('path');
const port = 8124;

const client = new net.Socket();
let adr=[];
let separator = "\t\v\t\r";
let stack=[];
const dec = "DEC";
const ack = "ACK";
const fl = "FILES";
const unknown = "UNKNOWN";
const dir = "Direct";
const client_name = "Client";
const server_name = "Server";
const accept = "File received";

client.setEncoding('utf8');

client.connection(port, function(){
   client.write(fl);
   console.log('Connected to the server');
});

client.on('data',function(data){
    if(data === ack)
    {
        console.log('Connection is established');
        send_files(adr);
    }
    if (data === dec)
    {
        console.log('Connection disabled');
        client.destroy();
    }
});

function get_address() {
    if(err) console.log('Bad address');
    for(let i = 2; i < process.argv.length; i++)
    {
        adr[i-2] = process.argv[i];
    }
    for (let i = 0; i < adr.length; i++) console.log(adr[i]);
}

function send_file(adr, err) {
    if(err) console.log('Sending did not happen');
    else {
        for (let ind = 0; ind, adr.length; ind++) {
            console.log("Start sending.");
            fs.readdirSync(adr[ind]).forEach((files) => {
                if (err) console.log("Error reading directory.");
                else {
                    console.log("Reading directories.");

                    let iffiles = adr[ind] + '\\' + files;
                    if (fs.statSync(iffiles).isDirectory()) send_file(iffiles);
                    else {
                        stack.push(iffiles);
                        console.log("Sending file.");
                    }
                }
            });
        }
        console.log("stack length:" + stack.length);
    }
}

function sendtoserver()
{
    console.log("send to server");
    let forsend=stack.pop();
    client.write(fs.readFileSync(forsend));
    client.write(separator+path.basename(forsend));
    client.write(separator+"FIN");
}