import Axios from 'axios';
import bcrypt from 'bcryptjs';

class User {
    _id; username; first_name; last_name; password; options; flags;
    constructor(data) {
        if ( data ) {
            this._id           = data._id         ?? null;
            this.username      = data.username    ?? null;
            this.first_name    = data.first_name  ?? null;
            this.last_name     = data.last_name   ?? null;
            this.password      = data.password    ?? null;
            this.options      = {
                isNewUser:      data.new_user ? true : false,
                verify_password: data.verify_password ?? null
            };
            this.flags         = {
                isValid:    false,
                isNewUser:  data.new_user ? true : false,
            };
        }
    }

    schema = {
        _id: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            expression: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        first_name: {
            type: String,
        },
        last_name: {
            type: String
        },
        password: {
            type: String,
            required: () => this.new_user
        },
    }

    url = {
        addNewUser: "/user",
        login: "/login",
        logout: "/logout",
    }

    async hashPassword() {        
                this.password = await bcrypt.hash(this.password, 5);
                return this;
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

    async save() {
        try {
            const result = await this.validateFormData().hashPassword().post('addNewUser');
            return result;
        } 
        catch (error) {
            console.error(error)
            return error;
        }
    }

    async post(action) {
        try {
            const response = await Axios.post(this.url[action], this);
            console.log(typeof response, response);
            return response?.data;
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    validateFormData() {
        if(this.flags.isNewUser && this.comparePasswords() === false) throw new Error(`Passwords do not match`)
        for(const [key, value] of Object.entries(this.schema)) {
            if( value.required && this[key] === null && !(this.flags.isNewUser) ) throw new Error(`${key} is required. Found ${this[key]}`);
            if( value.expression && value.expression.test(this[key]) === false ) throw new Error(`${key} error in expression`);
        }
        this.flags.isValid = true;
        return this;
    }

    comparePasswords() {
        if(this.options.verify_password !== this.password) {
            return false;
        }
        return true;
    }
}

export default User;