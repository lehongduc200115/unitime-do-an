import { ResponseToolkit, ServerRoute } from "@hapi/hapi";
import { Request } from "hapi";
import { HttpMethod, HttpStatus } from "../common/httpConstant";
import gaEngine from "../gaEngine/gaEngine";
import { ISheetRequest } from "./sheet.interface";

const postSheet: ServerRoute = {
  method: HttpMethod.POST,
  path: `/import`,
  options: {
    description: "Import data",
    tags: ["api", "import sheet"],
    handler: async (request: ISheetRequest, h: ResponseToolkit) => {
      const data = request.payload;

      // TODO: Code o day ne duc oi
      // transform "data" -> feed vao engine
      // good luck
      // const solve = gaEngine();

      return h
        .response({
          status: "success",
          data: data.data,
        })
        .code(HttpStatus.OK);
    },
  },
};

const sheetController: ServerRoute[] = [postSheet];
export default sheetController;
