import Axios from 'axios';

export default class DataModel {
/**
 * 
 * @param {object} data 
 * @param {string} action 
 */
    constructor ( data, action ) {
        if( data ) {
            this._id    = data._id ?? null;
        } else {
            this._id = null;
        }
        this.flags  = {
            isValid: false,
        };
        this.action = action || '';
        this.url = {
        }
        this.requireValidation = {
        }
    }

    setURL = {
        create: (url, requireValidation) => {
            this.requireValidation.create = requireValidation;
            this.url.create = url;
        },
        getAll: (url, requireValidation) => {
            this.requireValidation.getAll = requireValidation;
            this.url.getAll = url;
        },
        delete: (url, requireValidation) => {
            this.requireValidation.delete = requireValidation;
            this.url.delete = url;
        },
        edit: (url, requireValidation) => {
            this.requireValidation.edit = requireValidation;
            this.url.edit = url;
        },
        custom: (methodName, url, requireValidation) => {
            this.requireValidation[methodName] = requireValidation;
            this.url[methodName] = url;
        }
    }

    setSchema( schema ) {
        this.schema = schema;
    }

    setRequireValidation( requireValidation ) {
        this.requireValidation[this.action] = requireValidation
    }

    requiredActions( ...actions ) {
        return actions.includes(this.action);
    }

    async post ( ) {
        if(this.requireValidation[this.action]) await this.validateFormData()
        if( ! this.validationError ) {
            try {
                const response = await Axios.post(this.url[this.action], this);
                return response;
            } catch (error) {
                console.error(error);
                return error;
            }
        } else {
            return this.validationError
        }
    }

    async get ( ) {
        try {
            console.log("this.url[action]", this.url[this.action]);
            const result = await Axios.get(this.url[this.action]);
            return result;
        }
        catch ( error ) {
            console.log( error );
            return error;
        }
    }

    async delete ( ) {
        console.log("this.delete: (this) ", this);
        try {
            console.log("this.url[action]", `${this.url[this.action]}`)
            const result = await Axios.delete( this.url[this.action] );
            return result;
        }
        catch ( error ) {
            console.log( error );
        }
    }
    
    async edit ( ) {
        console.log("this.edit: (this) ", this);
        try {
            console.log("this.url[action]", `${this.url[this.action]}`);
            const result = await Axios.patch( this.url[this.action], this );
            return result;
        }
        catch ( error ) {
            console.error( error );
        }
    }

    setError(Error) {
        console.log("SetError():", Error)
        this.validationError = Error;
    }

    async validateFormData( ) {
            console.log("validating")
    
            for(const [key, value] of Object.entries(this.schema)) {
                
                if (value.required && value.required() && this[key] === null ) {
                    console.log(`${value}.required() `, value.required())
                    this.setError( new Error(`${key} is required. Found ${this[key]}`))
                    break;
                };
                
                if( value.expression && value.expression.test(this[key]) === false ) {
                    console.log(`Testing expression for ${this[key]} and ${value.expression}`, value.expression.test(this[key]))
                    this.setError(Error(`Error in expression for ${key}: value found: ${this[key]}`))
                    break;
                };
                
                if( value.validators && value.validators.length > 0 ) {
                    for( const [ func, actions ] of value.validators ) {
                        if(actions.includes(this.actions)) {
                            const result = func( );
                            if( ! result ) {
                                this.setError(`${value } did not pass`);
                            }
                        }
                    }
                };

                if( value.methods && value.methods.length > 0 ) {
                    for( const [ func, actions ] of value.methods ) {
                        if(actions.includes(this.actions)) {
                            const result = await func();
                            if( ! result ) {
                                this.setError(`${value } did not pass`);
                            }
                        }
                    }
                };

            }
            
            
        this.flags.isValid = true;
        return;
    }

}