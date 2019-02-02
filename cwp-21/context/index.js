module.exports = (Sequelize, config)=>{
    const  sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, {
        host:config.db.host,
        dialect:"mssql",
        logging: false,
        define: {
            timestamps: true,
            paranoid: true
        }
    });

    sequelize.authenticate().then(()=>{
        console.log('Connection to database successful');
    }).catch((err)=>{
        console.log('Unable to connect to database', err);
    });
    const property = require('../models/property')(Sequelize, sequelize);
    const offices = require('../models/offices')(Sequelize, sequelize);
    const agents = require('../models/agents')(Sequelize, sequelize);

    //sequelize.sync({ force: true });

    agents.hasMany(property, {foreignKey: 'agentId'});
    property.belongsTo(agents, {constraints: false, foreignKey: 'agentId'});

    offices.hasMany(agents, {foreignKey: 'officeId'});
    agents.belongsTo(offices, {constraints: false, foreignKey: 'officeId'});

    return {
        properties: Property,
        offices: Offices,
        agents: Agents,
        sequelize,
        Sequelize,
    };
};
