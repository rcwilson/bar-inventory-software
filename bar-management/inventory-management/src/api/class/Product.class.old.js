import Axios from 'axios';

class Product {
    _id; name; unit; category; package_units; package_type; package_price; distributor;
    constructor ( data, action ) {
        if ( data ) {
            this._id            = data._id ?? null;
            this.name           = data.name ?? null;
            this.unit           = data.unit ?? null;
            this.category       = data.category ?? null;
            this.package_units  = data.package_units ?? null;
            this.package_type   = data.package_type ?? null;
            this.package_price  = data.package_price ?? null;
            this.distributor    = data.distributor ?? null;

            this.flags = {
                isValid: false
            }
            this.action = action ?? null;
        }
    }

    schema = {
        _id: {
            type: String,
            required: () => ( this.action && this.action === 'edit' ),
        },
        name: {
            type: String,
            required: true
        },
        package_units: {
            type: Number,
        },
        package_type: {
            type: String
        },
        package_price: {
            type: Number
        },
        distributor: {
            type: String,
        },
    }

    url = {
        'getAll': "/products",
        'addNewProduct' : "/products"
    }

    validateFormData() {
        for(const [key, value] of Object.entries(this.schema)) {
            console.log(typeof value.required, key,value)
            switch( typeof value.required ) {
                case 'function' : if ( value.required() && this[key] === null ) {
                    throw new Error(`${key} is required. Found ${this[key]}`)
                };
                    break;
                default : if ( value.required && this[key] === null ) { 
                    throw new Error(`${key} is required. Found ${this[key]}`);
                }
                    break;
            }
            if( value.expression && value.expression.test(this[key]) === false ) throw new Error(`${key} error in expression`);
        }
        this.flags.isValid = true;
        return this;
    }

    async save() {
        try {
            console.log(this)
            const result = await this.validateFormData().post('addNewProduct');
            return result;
        } 
        catch (error) {
            console.error(error)
            return error;
        }
    }

    async post(action) {
        try {
            const result = await Axios.post(this.url[action], this);
            console.log(typeof result, result);
            return result;
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async get ( action ) {
        try {
            console.log("this.url[action]", this.url[action])
            const result = await Axios.get(this.url[action]);
            if( result.status === 401 ) {
                window.location = "/login";
            }
            else {
                return result.data.products
            }
        }
        catch ( error ) {
            console.log( error );
        }
    }
}

export default Product;