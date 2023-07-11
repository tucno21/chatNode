"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = __importDefault(require("../core/model"));
const User = new model_1.default();
User.define({
    tableName: 'usuario',
    primaryKey: 'id',
    fillable: [
        'nombre',
        'email',
        'password',
        'online'
    ],
    hidden: [
        'password'
    ]
});
exports.default = User;
//# sourceMappingURL=user.js.map