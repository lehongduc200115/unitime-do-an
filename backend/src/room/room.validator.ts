import { RouteOptionsValidate } from "@hapi/hapi";
import Joi from "joi";

const idParamValidator = Joi.object({
  id: Joi.string().hex().length(24),
});

export const getValidator: RouteOptionsValidate = {
  params: idParamValidator,
};

export const createValidator: RouteOptionsValidate = {
  payload: Joi.array().items(
    Joi.object({
      id: Joi.string(),
      department: Joi.string().optional(),
      capacity: Joi.number(),
      classType: Joi.string().optional(),
    })
  ),
};

export default {
  getValidator,
  createValidator,
};
