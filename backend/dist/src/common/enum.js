"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = exports.SortTypeEnum = exports.SortFieldEnum = void 0;
var SortFieldEnum;
(function (SortFieldEnum) {
    SortFieldEnum["STATUS"] = "status";
    SortFieldEnum["CREATED_AT"] = "createdAt";
    SortFieldEnum["UPDATED_AT"] = "updatedAt";
})(SortFieldEnum = exports.SortFieldEnum || (exports.SortFieldEnum = {}));
var SortTypeEnum;
(function (SortTypeEnum) {
    SortTypeEnum["ASCENDING"] = "asc";
    SortTypeEnum["DESCENDING"] = "desc";
})(SortTypeEnum = exports.SortTypeEnum || (exports.SortTypeEnum = {}));
var Status;
(function (Status) {
    Status["ACTIVE"] = "ACTIVE";
    Status["INACTIVE"] = "INACTIVE";
    Status["DELETE"] = "DELETE";
})(Status = exports.Status || (exports.Status = {}));
//# sourceMappingURL=enum.js.map