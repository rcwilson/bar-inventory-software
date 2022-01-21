import bcrypt from 'bcryptjs';
import DataModel from './DataModel.class';
import Expression from './Expression';

class User extends DataModel {
    constructor(data, action) {

        super( data, action );

        if ( data ) {
            this.username        = data.username;
            this.first_name      = data.first_name;
            this.last_name       = data.last_name;
            this.password        = data.password;
            this.verify_password = data.verify_password;
            this.options       = {
                verify_password: data.verify_password ?? null
            };
        }

        this.setURL.create('/user/new', true);
        this.setURL.custom('login', '/login', false);
        this.setURL.custom('logout', '/logout', false);

        this.setSchema({
            _id: {
                type: String,
                required: () => ( this.requiredActions('edit', 'delete') ),
            },
            username: {
                type: String,
                required: () => ( this.requiredActions('create') ),
                expression: Expression.email,
            },
            first_name: {
                type: String,
                required: () => ( this.requiredActions('create') )
            },
            last_name: {
                type: String,
                required: () => ( this.requiredActions('create') )
            },
            password: {
                type: String,
                required: () => ( this.requiredActions('create') ),
                validators: [ [this.comparePasswords, ['create']] ],
                methods: [ [this.hashPassword, ['create', 'login']] ]

            },
        })

        console.log("New Object: ", this)
    }

    async hashPassword() {  
        this.password = await bcrypt.hash(this.password, 5);
        return true;
    }

    comparePasswords() {
        if(this.verify_password !== this.password) {
            return false;
        }
        return true;
    }

    async login() {
        try {
            const result = await this.post('login');
            return result;
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async logout() {
        try {
            const result = await this.post('logout');
            return result;
        } catch (error) {
            console.error(error);
            return error;
        }
    }
    
}

export default User;