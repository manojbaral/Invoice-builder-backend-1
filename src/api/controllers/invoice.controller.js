import Joi from 'joi';
import HttpStatus from 'http-status-codes';
import Invoice from '../models/invoice.model';

export default {
  findAll(req, res, next) {
    const { page = 1, perPage = 10 } = req.query;
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(perPage, 10),
    };
    Invoice.paginate({}, options)
      .then(invoices => {
        setTimeout(() => res.json(invoices), 5000);
      })
      .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
  },
  create(req, res, next) {
    const schema = Joi.object().keys({
      item: Joi.string().required(),
      date: Joi.date().required(),
      due: Joi.date().required(),
      qty: Joi.number()
        .integer()
        .required(),
      tax: Joi.number().optional(),
      rate: Joi.number().optional(),
    });
    const { error, value } = Joi.validate(req.body, schema);
    if (error && error.details) {
      return res.status(HttpStatus.BAD_REQUEST).json(error);
    }
    Invoice.create(value)
      .then(invoice => res.json(invoice))
      .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
  },
  findOne(req, res) {
    const { id } = req.params;
    Invoice.findById(id)
      .then(invoice => {
        if (!invoice) {
          return res.status(HttpStatus.NOT_FOUND).json({ err: 'Could not find any invoice' });
        }
        return res.json(invoice);
      })
      .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
  },
  delete(req, res) {
    const { id } = req.params;
    Invoice.findByIdAndRemove(id)
      .then(invoice => {
        if (!invoice) {
          return res.status(HttpStatus.NOT_FOUND).json({ err: 'Could not delete any invoice' });
        }
        return res.json(invoice);
      })
      .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
  },
  update(req, res) {
    const { id } = req.params;
    const schema = Joi.object().keys({
      item: Joi.string().optional(),
      date: Joi.date().optional(),
      due: Joi.date().optional(),
      qty: Joi.number()
        .integer()
        .optional(),
      tax: Joi.number().optional(),
      rate: Joi.number().optional(),
    });
    const { error, value } = Joi.validate(req.body, schema);
    if (error && error.details) {
      return res.status(HttpStatus.BAD_REQUEST).json(error);
    }
    Invoice.findOneAndUpdate({ _id: id }, value, { new: true })
      .then(invoice => res.json(invoice))
      .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
  },
};
