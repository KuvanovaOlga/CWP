const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const errors = require('./helpers/errors.js');

const PropertiesService = require('./services/properties.js');
const AgentsService = require('./services/agents');
const OfficesService = require('./services/offices');
const CacheService = require('./services/cache');
const LoggerService = require('./services/logging');

module.exports = (db, config) => {
    const app = express();
    const propertiesService = new PropertiesService(
        db.properties,
        errors
    );

    const agentsService = new AgentsService(
        db.properties,
        db.agents,
        errors
    );
    const officesService = new OfficesService(
        db.agents,
        db.offices,
        errors
    );

    const cacheService = new CacheService();
    const loggerService = new LoggerService();

    const logger = require('./global-controllers/logging.js')(loggerService);
    const cache = require('./global-controllers/cache.js')(cacheService, loggerService);

    const error = require('./global-controllers/error.js');

    const apiController = require('./controllers/api.js')(
        propertiesService,
        agentsService,
        officesService,
        loggerService,
        cacheService,
        config
    );
    app.use(express.static('public'));
    app.use(cookieParser(config.cookie.key));
    app.use(bodyParser.json());
    app.use('/api', logger);
    app.use('/api', cache);
    app.use('/api', apiController);
    app.use('/api', error);

    return app;
};