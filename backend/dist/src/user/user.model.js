"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const enum_1 = require("../common/enum");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    status: {
        type: String,
        default: enum_1.Status.ACTIVE,
        required: true,
        index: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
        required: true,
        index: true,
    },
    isAccountOwner: {
        type: Boolean,
        default: false,
        index: true,
    },
    createdBy: {
        type: String,
    },
    updatedBy: {
        type: String
    },
}, {
    timestamps: true,
    versionKey: false
});
userSchema.set('toObject', {
    virtuals: true
});
exports.UserModel = mongoose_1.default.model("user", userSchema);
//# sourceMappingURL=user.model.js.map