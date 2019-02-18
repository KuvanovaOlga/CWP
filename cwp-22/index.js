const info = require ('./package.json');
console.log('Hello, I am ' + info.version);

let operators = {
    '+': function(a, b) { return b + a },
    '-': function(a, b) { return b - a },
    '*': function(a, b) { return b * a },
    '/': function(a, b) { return b / a },
};

let isOperator = function(token) {
    return token in operators
};

let isValue = function(token) {
    return /\d+/.test(token)
};

module.exports = function(notation){
    notation = notation.trim();

    if(notation === ""){
        return null;
    }
    let tokens = notation.split(' ');

    let stack = [];
    while (tokens.length) {
        let token = tokens.shift();

        if (isValue(token)) {
            stack.push(Number(token))

        }
        else if (isOperator(token)) {
            let a = stack.pop();
            let b = stack.pop();
            if (a === null || b === null){
                return null ;
            }
            stack.push(operators[token](a, b))
        }
        else {
            return null;
        }
    }

    if (stack.length !== 1) {
        return null;
    }

    return stack.pop();
};