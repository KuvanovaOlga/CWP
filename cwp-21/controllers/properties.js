const CrudController = require('./Crud');

class PropertiesController extends CrudController {
    constructor(propertiesService, cahceService) {
        super(propertiesService);

        this.cacheService = cahceService;

        this.readAll = this.readAll.bind(this);
        this.addAgent = this.addAgent.bind(this);
        this.removeAgent = this.removeAgent.bind(this);

        this.routes['/'] = [{ method: 'get',
            cb: this.readAll }];
        this.routes['/addAgent'] = [{ method: 'post',
            cb: this.addAgent }];
        this.routes['/removeAgent'] = [{ method: 'post',
            cb: this.removeAgent }];

        this.registerRoutes();

    }
    async readAll(req, res) {
        const properties = await this.service.readChunk(
            req.query
        );
        if(!(await this.cacheService.invalidate(req))) this.cacheService.set(req, properties);

        res.json(properties);
    }

    async addAgent(req, res){
        const result = await this.service.addAgent(req.body);
        res.json(result);
    }

    async removeAgent(req, res){
        const result = await this.service.removeAgent(req.body.id);
        res.json(result);
    }

}

module.exports = (propertiesService, cacheService) => {
    const controller = new PropertiesController(
        propertiesService,
        cacheService
    );

    return controller.router;
};
