const fs = require('fs');
const path = require('path');

const pat = process.argv[2];

const copyright = JSON.parse(fs.readFileSync("./cop.json")).cop;

let script='const fs = require(\'fs\');\n' +
    'const path = require(\'path\');\n' +
    '\n' +
    '(function getFiles(baseDir) {\n' +
    '    fs.readdir(baseDir, function (err, files){\n' +
    '        for (let i in files) {\n' +
    '            let currentDir = baseDir + path.sep + files[i];\n' +
    '            fs.stat(currentDir, (err, stats) => {\n' +
    '                    if (stats.isDirectory()) {\n' +
    '                        getFiles(currentDir);\n' +
    '                    } else {\n' +
    '                        console.log(path.relative(__dirname, currentDir));\n' +
    '                    }\n' +
    '                }\n' +
    '            );\n' +
    '        }\n' +
    '    });\n' +
    '})(__dirname, null);\n';

if(pat) {
    fs.stat(pat,function (error, statistics) {
        if(error){
            console.log('path error');
        } else{
            create_summary(pat);
            make_dir(pat);
            watchDir(pat);
        }
    })
}

function create_summary(pat) {
    fs.writeFile(pat+'\\Summary.js', script, function (error) {
            if (error) console.log('Error creating file.');
            else console.log('Summary created.');
        }
    );
}

function make_dir(pat) {
    let dir_for_make=pat+'\\'+path.basename(pat);
    fs.mkdir(dir_for_make, function(err){
        if(err) console.log('Error creating directory.');
        else console.log('Directory created.');
    });
    writefile(pat,dir_for_make);
}

function writefile(pat, made_dir){
    fs.readdir(pat, function(err, files){
        if(err) console.log('Error reading the directory.');
        else {
            for(let i in files){
                let files_or_directories=pat+'\\'+files[i];
                if(fs.statSync(files_or_directories).isDirectory())
                    writefile(files_or_directories,made_dir);
                else {
                    if(path.extname(files_or_directories)===".txt") {
                        fs.readFile(files_or_directories,'utf8' ,(err, data)=>{
                                if(err)console.log('Error reading file.');
                                else {
                                    fs.writeFile(made_dir + `\\` + files[i], copyright+`\r\n`+ data + `\r\n` + copyright );
                                }
                            }
                        );
                    }
                }
            }
        }
        }
    );
}

function watchDir(dirForTxt) {
    fs.watch(dirForTxt, (eventType, filename) => {
        console.log(`event type is: ${eventType}`);
        if (filename) {
            console.log(`filename provided: ${filename}`);
        } else {
            console.log('filename not provided');
        }
    });
}


