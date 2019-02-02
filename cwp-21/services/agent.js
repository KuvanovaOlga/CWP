const CrudService = require('./crud');
const joi = require('joi');

class AgentsService extends CrudService{
    constructor(props, agents, errors){
        super(agents, errors);
        this.propsRepositoriy = props;
        this.nulldata = {agentId:null};
    }

    async readChunk(options){
        const validation = joi.object().keys({
            limit:joi.number().integer().valid(5,10,15,20,25),
            offset:joi.number().integer().positive(),
            sortOrder: joi.string().valid('asc','desc'),
            sortField: joi.string().valid('id','name','email','tel','officeId')
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
            name: joi.string().required(),
            email: joi.string().email().required(),
            tel: joi.string().required(),
            officeId: joi.number().integer().positive().required()
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
            name: joi.string().optional(),
            email: joi.string().email().optional(),
            tel: joi.string().optional(),
            officeId: joi.number().integer().positive().optional()
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
        await this.propsRepositoriy.update(this.nulldata, {
            where: { agentId:id }
        });
        return super.delete(id);
    }

    async addOffice(data){
        const validation = joi.object().keys({
            id: joi.number().integer().positive().required(),
            officeId: joi.number().integer().positive().required()
        });
        let flag = false;
        await validation.validate(data)
            .then(()=>{
                return super.update(data.id, data);
            })
            .catch((err)=>{
                flag = true;
            });
        if(flag) return this.errors.createError;
    }

    async removeOffice(id){
        id = parseInt(id);

        if (isNaN(id)) {
            throw this.errors.invalidId;
        }

        return super.update(id, this.nulldata);
    }

    async readProps(data){
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

        return await this.propsRepositoriy.findAll({
            where : {
                agentId:data.id
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

module.exports = AgentsService;