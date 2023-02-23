import { RouteOptionsValidate } from "@hapi/hapi";
import Joi from "joi";
import { ClassType } from "../common/enum";

const idParamValidator = Joi.object({
  id: Joi.string().hex().length(24),
});

export const getValidator: RouteOptionsValidate = {
  params: idParamValidator,
};

export const createValidator: RouteOptionsValidate = {
  payload: Joi.array().items(
    Joi.object({
      name: Joi.string(),
      department: Joi.string(),
      numLabHours: Joi.number(),
      numLecHours: Joi.number(),
      preferedWeekDay: Joi.number(),
      preferedTime: Joi.number(),
      capacity: Joi.number(),
      classType: Joi.string().optional(),
    })
  ),
};

export default {
  getValidator,
  createValidator,
};
