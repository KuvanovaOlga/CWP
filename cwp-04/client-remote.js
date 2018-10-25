const net = require('net');
const fs = require('fs');
const path=require('path');
const port = 8124;
let adr=[];
let separator = "||";
const dec = "DEC";
const ack = "ACK";
const remote = "Remote";
const unknown = "UNKNOWN";
const dir = "Direct";
const client_name = "Client";
const server_name = "Server";
const accept = "File received";
const client = new net.Socket();
client.setEncoding('utf8');

client.connect(port, function() {
    client.write(remote);
    console.log(`Connected to the server`);
});

client.on(`data`, function (data){
    if(data === ack) {
        console.log(`connection established`);
        client.write(`COPY` + separator + `from.txt` + separator + `to.txt`);
    }
    if(data === `copy`) {
        console.log(`start encoding`);
        client.write(`ENCODE` + separator + `to.txt` + separator + `encode.txt` + separator + `kek`);
    }
    if(data === `encode`) {
        console.log(`start encoding`);
        client.write( `DECODE` + separator + `encode.txt` + separator + `decode.txt` + separator + `kek`);
    }
    if(data===`decode`) {
        console.log(`finish app`);
        client.end();
    }
});


function get_adress(adr, err){
    if (err) console.log(`Bad adress.`)
    for(var i = 2; i < process.argv.length; i++){
        adr[i-2] = process.argv[i];
    }
    for (let i=0; i<adr.length;i++) console.log(adr[i]);
}

function send_file(adr, err) {
    if (err) console.log(`Sending is not success.`);
    else {
        for (let ind = 0; ind < adr.length; ind++) {
            console.log(`Start sending.`);
            fs.readdirSync(adr[ind]).forEach((files) => {
                if (err) console.log(`Error reading directory.`);
                else {
                    console.log(`Reading directory.`);
                    let iffiles = adr[ind] + '\\' + files;
                    if (fs.statSync(iffiles).isDirectory()) send_file(iffiles);
                    else {
                        stack.push(iffiles);
                    }

                }
            });
        }
    }
}
