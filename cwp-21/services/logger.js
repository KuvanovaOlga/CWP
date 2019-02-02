const Winston = require('winston');
const Moment = require('moment');
Winston.cli();

Winston.add(Winston.transports.File, {
    level:'info',
    filename:'./logs/all-logs.log',
    handleException:true,
    json:true,
    maxsize:512,
    colorize:false,
    eol:'\r\n'
});
Winston.remove(Winston.transports.Console);


Winston.stream = {
    write: function(msg, encoding){
        Winston.info(msg);
    }
};

class LoggerService{
    constructor(){
        this.Winston = Winston;
    }
    async log(msg){
        this.Winston.stream.write(
            `time:${Moment().format('HH:mm:ss')}`+' '
            + `URL:${msg.path}`+' '
            + `Method:${msg.method}`+' '
            + `Param:${JSON.stringify(msg.query)}`+' '
            + `Body:${JSON.stringify(msg.body)}`);
    }
    async logC(msg){
        this.Winston.stream.write(
            `time:${Moment().format('HH:mm:ss')}`+' '
            + `URL:${msg.path}`+' '
            + `Method:${msg.method}`+' '
            + 'FROM CACHE');
    }
}

module.exports = LoggerService;