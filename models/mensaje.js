const { Schema, model } = require('mongoose');

const MensajeSchema = Schema({
    de: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El nombre es obligatorio']
    },
    para: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El nombre es obligatorio']
    },
    mensaje: {
        type: String,
        required: [true, 'El mensaje es obligatorio']
    }
}, {
    timestamps: true
});

MensajeSchema.method('toJSON', function () {
    const { __v, ...object } = this.toObject();
    return object;
});

module.exports = model('Mensaje', MensajeSchema);