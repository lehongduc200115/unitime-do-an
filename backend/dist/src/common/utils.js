"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = void 0;
exports.utils = {
    fillWith: (arr, expectedLength, x) => {
        arr.length = expectedLength;
        return Array.from(arr, (v) => (v ? v : x));
    },
};
//# sourceMappingURL=utils.js.map