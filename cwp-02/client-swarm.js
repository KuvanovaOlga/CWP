let { execFile } = require('child_process');

let num = process.argv[2];

for (let i = 0; i < num; i++)
{
    let child = execFile('node', ['client.js'], (error) =>
    {
        if (error)
        {
            throw error;
        }
    });
}