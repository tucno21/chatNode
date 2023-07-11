"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerChat = void 0;
const mensaje_1 = __importDefault(require("../model/mensaje"));
const obtenerChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { de } = req.params;
        const { dataToken } = req.body;
        const query = `SELECT * FROM mensaje WHERE (de = ${de} AND para = ${dataToken.id}) OR (de = ${dataToken.id} AND para = ${de}) ORDER BY created_at ASC LIMIT 30`;
        const mensajes = yield mensaje_1.default.customQuery(query);
        return res.status(200).json({
            ok: true,
            mensajes
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: 'Error interno del servidor'
        });
    }
});
exports.obtenerChat = obtenerChat;
//# sourceMappingURL=mensajeController.js.map