const CrudService = require('./сrud');
const joi = require('joi');

class PropertiesService extends CrudService {

    async create(data){
        const validation = joi.object().keys({
            heading: joi.string().required(),
            price: joi.number().integer().positive().required(),
            currency: joi.string().valid('BYN','EUR','USD').required(),
            location: joi.string().required(),
            agentId: joi.number().integer().positive().optional()
        });
        let flag = false;
        await validation.validate(data)
            .then(()=>{
                const prop = {};
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        prop[key] = data[key];
                    }
                }
                return super.create(prop);
            })
            .catch((err)=>{
                flag = true;
            });
        if(flag) return this.errors.createError //throw super.errors.createError;
    };

    async readChunk(options){
        const validation = joi.object().keys({
            limit:joi.number().integer().valid(5,10,15,20,25),
            offset:joi.number().integer().positive(),
            sortOrder: joi.string().valid('asc','desc'),
            sortField: joi.string().valid('id','heading','price','currency','location','agentId')
        });
        let flag = false;
        await validation.validate(options)
            .catch(()=>{
                flag = true;
            });
        if(flag) throw this.errors.optionsError;

        return await super.readChunk(options);
    };

    async readId(id){
        return super.read(id);
    };

    async update(data){
        const validation = joi.object().keys({
            id: joi.number().integer().positive().required(),
            heading: joi.string().optional(),
            price: joi.number().integer().positive().optional(),
            currency: joi.string().valid('BYN','EUR','USD').optional(),
            location: joi.string().optional(),
            agentId: joi.number().integer().positive().optional()
        });
        let flag = false;
        await validation.validate(data)
            .then(()=>{
                const prop = {};
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        prop[key] = data[key];
                    }
                }
                return super.update(prop.id,prop);
            })
            .catch((err)=>{
                flag = true;
            });
        if(flag) return this.errors.createError //throw super.errors.createError;
    };

    async addAgent(data){
        const validation = joi.object().keys({
            id: joi.number().integer().positive().required(),
            agentId: joi.number().integer().positive().required()
        });
        let flag = false;
        await validation.validate(data)
            .then(()=>{
                return super.update(data.id, data);
            })
            .catch((err)=>{
                flag = true;
            });
        if(flag) return this.errors.createError //throw super.errors.createError;;
    };

    async removeAgent(id){
        const data = {
            agentId : null
        };
        id = parseInt(id);

        if (isNaN(id)) {
            throw this.errors.invalidId;
        }
        return super.update(id, data);
    };
}

module.exports = PropertiesService;
