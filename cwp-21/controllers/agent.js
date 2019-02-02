const CrudController = require('./crud');

class AgentsController extends CrudController {
    constructor(agentsService, cahceService) {
        super(agentsService);

        this.cacheService = cahceService;

        this.readAll = this.readAll.bind(this);
        this.addOffice = this.addOffice.bind(this);
        this.removeOffice = this.removeOffice.bind(this);
        this.readProps = this.readProps.bind(this);

        this.routes['/'] = [{ method: 'get',
            cb: this.readAll }];
        this.routes['/addOffice'] = [{ method: 'post',
            cb: this.addOffice }];
        this.routes['/removeOffice'] = [{ method: 'post',
            cb: this.removeOffice }];
        this.routes['/props'] = [{ method: 'post',
            cb: this.readProps }];

        this.registerRoutes();

    }
    async readAll(req, res) {
        const properties = await this.service.readChunk(
            req.query
        );
        if(!(await this.cacheService.invalidate(req))) this.cacheService.set(req, properties);

        res.json(properties);
    }

    async readProps(req, res) {
        const properties = await this.service.readProps(
            req.body
        );

        res.json(properties);
    }

    async addOffice(req, res){
        const result = await this.service.addOffice(req.body);
        res.json(result);
    }

    async removeOffice(req, res){
        const result = await this.service.removeOffice(req.body.id);
        res.json(result);
    }
}

module.exports = (agentsService, cacheService) => {
    const controller = new AgentsController(
        agentsService,
        cacheService
    );

    return controller.router;
};
