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
exports.grabarMensaje = exports.getUsuarios = exports.usuarioDesconectado = exports.usuarioConectado = void 0;
const user_1 = __importDefault(require("../model/user"));
const mensaje_1 = __importDefault(require("../model/mensaje"));
const usuarioConectado = (id = '') => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usuario = yield user_1.default.where('id', id).first();
        usuario.online = true;
        yield user_1.default.update(usuario.id, { online: true });
        return usuario;
    }
    catch (error) {
        console.log(error);
        return null;
    }
});
exports.usuarioConectado = usuarioConectado;
const usuarioDesconectado = (uid = '') => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usuario = yield user_1.default.where('id', uid).first();
        usuario.online = false;
        yield user_1.default.update(usuario.id, { online: false });
        return usuario;
    }
    catch (error) {
        console.log(error);
        return null;
    }
});
exports.usuarioDesconectado = usuarioDesconectado;
const getUsuarios = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usuarios = yield user_1.default.all();
        return usuarios;
    }
    catch (error) {
        console.log(error);
        return null;
    }
});
exports.getUsuarios = getUsuarios;
const grabarMensaje = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { de, para, mensaje } = payload;
        const nuevoMensaje = yield mensaje_1.default.create({
            de,
            para,
            mensaje
        });
        return nuevoMensaje;
    }
    catch (error) {
        console.log(error);
        return null;
    }
});
exports.grabarMensaje = grabarMensaje;
//# sourceMappingURL=socketController.js.map