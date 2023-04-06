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
      subjectId: Joi.number(),
      type: Joi.string().optional(),
      preferedWeekDay: Joi.string().optional(),
      preferedPeriod: Joi.string().optional(),
      entrants: Joi.number().optional(),
      period: Joi.string().optional(),
      scaleUpClass: Joi.string().optional(),
    })
  ),
};

export default {
  getValidator,
  createValidator,
};
