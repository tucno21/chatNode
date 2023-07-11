"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = __importDefault(require("../core/model"));
const Mensaje = new model_1.default;
Mensaje.define({
    tableName: 'mensaje',
    primaryKey: 'id',
    fillable: [
        'de',
        'para',
        'mensaje'
    ],
    timestamps: true,
});
exports.default = Mensaje;
//# sourceMappingURL=mensaje.js.map