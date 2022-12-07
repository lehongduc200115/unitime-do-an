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
  payload: Joi.object({
    department: Joi.string(),
    weeklyTimetable: Joi.array().items(Joi.array().items(Joi.boolean())),
    capacity: Joi.number(),
    classType: Joi.string()
      .valid(...Object.values(ClassType))
      .default(ClassType.LEC),
    coordinate: Joi.object({
      zone: Joi.string().valid("TD", "Q10"),
      block: Joi.string(),
      level: Joi.number(),
    }),
  }),
};

export default {
  getValidator,
  createValidator,
};
