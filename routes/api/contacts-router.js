import express from "express";

import contactsService from "../../models/contacts/contacts.js";
import {HttpError} from "../../helpers/index.js";
import Joi from "joi";

const contactsRouter = express.Router();

const contactAddSchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": `"title" must be exist`,
  }),
  director: Joi.string().required(),
})

contactsRouter.get('/', async (req, res, next) => {
  try {
    const result = await contactsService.listContacts();
    res.json(result);
  }
  catch (error) {
    next(error);
  }
})

contactsRouter.get('/:contactId', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.getContactById(id);
    if (!result) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.json(result);
  }
  catch (error) {
    next(error);
  }
})

contactsRouter.post('/', async (req, res, next) => {
  try {
    const { error } = contactAddSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await contactsService.addContact(req.body);
    res.status(201).json(result);
  }
  catch (error) {
    next(error);
  }
})

contactsRouter.delete('/:contactId', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.removeContact(id);
    if (!result) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }

    res.json({
      message: "Remove success"
    })
  }
  catch (error) {
    next(error);
  }
})

contactsRouter.put('/:contactId', async (req, res, next) => {
  try {
    const { error } = contactAddSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { id } = req.params;
    const result = await contactsService.updateContact(id, req.body);
    if (!result) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.json(result);
  }
  catch (error) {
    next(error);
  }
})

export default contactsRouter;
