const CrudController = require('./crud');

class OfficesController extends CrudController {
    constructor(officesService, cahceService) {
        super(officesService);

        this.cacheService = cahceService;

        this.readAll = this.readAll.bind(this);
        this.readAgents = this.readAgents.bind(this);

        this.routes['/'] = [{ method: 'get',
            cb: this.readAll }];
        this.routes['/agents'] = [{ method: 'post',
            cb: this.readAgents }];

        this.registerRoutes();

    }
    async readAll(req, res) {
        const properties = await this.service.readChunk(
            req.query
        );
        if(!(await this.cacheService.invalidate(req))) this.cacheService.set(req, properties);


        res.json(properties);
    }

    async readAgents(req, res) {
        const properties = await this.service.readAgents(
            req.body
        );

        res.json(properties);
    }
}

module.exports = (officesService, cacheService) => {
    const controller = new OfficesController(
        officesService,
        cacheService
    );

    return controller.router;
};
