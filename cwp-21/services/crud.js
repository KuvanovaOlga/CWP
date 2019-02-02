class CrudService {
    constructor(repository, errors) {
        this.repository = repository;
        this.errors = errors;

        this.defaults = {
            readChunk: {
                limit: 5,
                offset: 0,
                sortOrder: 'asc',
                sortField: 'id'
            }
        };
    }

    async readChunk(options) {
        let limit = Number(options.limit) || this.defaults.readChunk.limit;
        let offset = Number(options.offset) || this.defaults.readChunk.offset;

        return await this.repository.findAll({
            limit: limit,
            offset: offset,
            order: [[options.sortField, options.sortOrder.toUpperCase()]],
            raw: true
        });
    }

    async read(id) {
        id = parseInt(id);
        return await this.repository.findById(id, {raw: true});
    }

    async create(data) {
        await this.repository.create(data);
    }

    async update(id, data) {
        await this.repository.update(data, {where: {id: id}, limit: 1});
        return this.read(id);
    }

    async delete(id) {
        return this.repository.destroy({where: {id: id}});
    }
}

module.exports = CrudService;