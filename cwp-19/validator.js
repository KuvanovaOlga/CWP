const Joi = require('joi');

const schemas = {
	'/signin': Joi.object().keys({
		login: Joi.string(),
		password: Joi.string(),
	}),
	'/signup': Joi.object().keys({
		login: Joi.string(),
		password: Joi.string().min(10),
		email: Joi.string().email().optional(), //здесь пройдёт что-то типа "1@e", фикс через регулярку
		invitedBy: Joi.string().optional(),
		birth: Joi.date().max(new Date(new Date() - (21 * (365*24*60*60*1000) + 5))),
		sex: Joi.string().regex(/(?:male|female)/),
		agreedWithTerms: Joi.boolean().valid(true)
	}),
	'/drinks': Joi.object().keys({
		name: Joi.string().min(3).max(50),
		strength: Joi.number().min(0),
		code: Joi.string().regex(/^[a-z0-9]+$/i),
		alcoholic: Joi.any().when('strength', {is: Joi.number().greater(0), then: Joi.boolean().valid(true)})
	}),
	'/recipes': Joi.object().keys({
		name: Joi.string(),
		ingredients: Joi.array().min(2).items(Joi.object().keys({
			name: Joi.string(),
			weight: Joi.number().integer().min(0),
			photos: Joi.array().items(Joi.string()).optional()
		})).unique('name'),
		photos: Joi.array().items(Joi.string()).optional(),
		portions: Joi.alternatives().try(Joi.string(), Joi.number().greater(0))
	})
};

exports.check = function (schema, body) {
	if (!schemas[schema])
	{
		return {};
	}
	return Joi.validate(body, schemas[schema], { presence: 'required' });
};