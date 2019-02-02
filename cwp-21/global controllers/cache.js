module.exports = (cacheService, loggerService) => async (req, res, next) =>{
    const cached = await cacheService.get(req);

    if(cached){
        loggerService.logC(req);
        res.json(cached);
        return;
    }

    next();
};