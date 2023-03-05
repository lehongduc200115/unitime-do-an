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
      name: Joi.string().optional(),
      subjectId: Joi.string(),
      instructorId: Joi.string(),
      roomId: Joi.string(),
      weekDay: Joi.number(),
      startTime: Joi.number(),
      endTime: Joi.number(),
    })
  ),
};

export default {
  getValidator,
  createValidator,
};
