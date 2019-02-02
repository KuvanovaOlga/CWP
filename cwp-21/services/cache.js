const Assert = require('assert');
const Cache = require('lru-cache')({
    max:5,
    maxAge:30*1000
});


class CacheService{
    constructor(){
        this.Cache = Cache;
    }
    async set(req, data){
        this.Cache.set(req.method.toString()+req.originalUrl.toString(), data);
    }
    async get(req){
        return this.Cache.get(req.method.toString()+req.originalUrl.toString());
    }
    async invalidate(req) {
        return !!this.Cache.has(req.method.toString() + req.originalUrl.toString());
    }
}

module.exports = CacheService;