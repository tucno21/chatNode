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
exports.renewToken = exports.createUser = exports.getUser = void 0;
const user_1 = __importDefault(require("../model/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../helpers/jwt");
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        //verificar si el email existe
        const usuario = yield user_1.default.where('email', email).first();
        //si no existe
        if (usuario === undefined) {
            return res.status(400).json({
                ok: false,
                msg: 'El email no existe'
            });
        }
        // verificar password
        const validarPassword = bcryptjs_1.default.compareSync(password, usuario.password);
        if (!validarPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña es incorrecta'
            });
        }
        //generar el token
        const token = yield (0, jwt_1.generateJWT)({ id: usuario.id, email: usuario.email });
        //elimanar el password del objeto
        usuario.password = undefined;
        return res.json({
            ok: true,
            usuario,
            token
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: 'Error interno del servidor'
        });
    }
});
exports.getUser = getUser;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body } = req;
        //buscar si el email existe
        const comprobar = yield user_1.default.where('email', body.email).first();
        //si existe
        if (comprobar) {
            return res.status(400).json({
                ok: false,
                msg: 'El email ya existe'
            });
        }
        //encriptar password
        const salt = bcryptjs_1.default.genSaltSync();
        body.password = bcryptjs_1.default.hashSync(body.password, salt);
        //agreagar el online
        body.online = false;
        console.log(body);
        //guardar usuario
        const usuario = yield user_1.default.create(body);
        //generar el token
        const token = yield (0, jwt_1.generateJWT)({ id: usuario.id, email: usuario.email });
        return res.json({
            ok: true,
            usuario,
            token
        });
    }
    catch (error) {
        return res.status(500).json({
            msg: 'Error en el servidor',
            error: error.message
        });
    }
});
exports.createUser = createUser;
const renewToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { dataToken } = req.body;
    //generar el token
    const token = yield (0, jwt_1.generateJWT)({ id: dataToken.id, email: dataToken.email });
    //obtener el usuario por uid
    const usuario = yield user_1.default.find(dataToken.id);
    return res.json({
        ok: true,
        usuario,
        token
    });
});
exports.renewToken = renewToken;
//# sourceMappingURL=authController.js.map