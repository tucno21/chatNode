import Model from "../core/model";

const Mensaje = new Model;

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

export default Mensaje;