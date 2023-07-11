import Model from "../core/model";

const User = new Model();

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

export default User;
