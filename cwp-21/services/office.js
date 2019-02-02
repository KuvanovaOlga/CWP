const CrudService = require('./crud');
const joi = require('joi');

class OfficesService extends CrudService{
    constructor(agents, offices, errors){
        super(offices, errors);
        this.agentsRepository = agents;
        this.nulldata = {officeId:null};
    }

    async readChunk(options){
        const validation = joi.object().keys({
            limit:joi.number().integer().valid(5,10,15,20,25),
            offset:joi.number().integer().positive(),
            sortOrder: joi.string().valid('asc','desc'),
            sortField: joi.string().valid('id','title','website','address')
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

    async create(data){
        const validation = joi.object().keys({
            title: joi.string().required(),
            website: joi.string().required(),
            address: joi.string().required()
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

    async update(data){
        const validation = joi.object().keys({
            id: joi.number().integer().positive().required(),
            title: joi.string().optional(),
            website: joi.string().optional(),
            address: joi.string().optional()
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

    async delete(id){
        await this.agentsRepository.update(this.nulldata, {
            where: { officeId: id }
        });
        return super.delete(id);
    }

    async readAgents(data){
        const validation = joi.object().keys({
            id: joi.number().integer().positive().required(),
            limit:joi.number().integer().positive().optional(),
            offset:joi.number().integer().positive().optional()
        });
        let flag = false;
        await validation.validate(data)
            .catch(()=>{
                flag = true;
            });
        if(flag) throw this.errors.optionsError;

        const limit = data.limit?data.limit:null;
        const offset = data.offset?data.offset:null;

        return await this.agentsRepository.findAll({
            where : {
                officeId:data.id
            },
            limit: limit,
            offset: offset,
            order: [[
                'id',
                'ASC'
            ]],
            raw: true
        });
    }
}

module.exports = OfficesService;