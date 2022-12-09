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
      weeklyTimetable: Joi.array().items(Joi.array().items(Joi.boolean())),
      classType: Joi.string()
        .valid(...Object.values(ClassType))
        .default(ClassType.ALL),
    })
  ),
};

export default {
  getValidator,
  createValidator,
};
