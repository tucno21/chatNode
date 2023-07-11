const jwt = require('jsonwebtoken');

interface Props {
    id: number;
    email: string;
}

export const generateJWT = ({ id, email }: Props) => {

    return new Promise((resolve, reject) => {

        const payload = { id, email };

        jwt.sign(payload, process.env.JWT_SECRET, {

            expiresIn: '24h'

        }, (err: any, token: any) => {

            if (err) {


                reject('No se pudo generar el token');

            } else {

                resolve(token);

            }
        });
    });
}

export const comprobarJWT = (token: string = '') => {
    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        return [true, id];
    } catch (error) {
        return [false, null];
    }
}