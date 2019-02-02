const express = require('express');

module.exports=(
    PropertiesService,
    AgentsService,
    OfficesService,
    LoggerService,
    CacheService,
    config
)=>{
    const Router = express.Router();
    const PropertiesController = require('./Properties')(
        PropertiesService,
        CacheService
    );
    const AgentsController = require('./Agents')(
        AgentsService,
        CacheService
    );
    const OfficesController = require('./Offices')(
        OfficesService,
        CacheService
    );
    Router.use('/properties', PropertiesController);
    Router.use('/agents', AgentsController);
    Router.use('/offices', OfficesController);
    return Router;
};