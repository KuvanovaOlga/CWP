const info = require ('.package.json');
console.log('Hello, I am ' + info.version);

let operators = {
    '+': function(a, b) { return b + a },
    '-': function(a, b) { return b - a },
    '*': function(a, b) { return b * a },
    '/': function(a, b) { return b / a },
};

module.exports = function(notation){
    notation = notation.trim();

    if(notation === ""){
        return null;
    }
};