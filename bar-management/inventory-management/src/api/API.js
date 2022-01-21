import Axios from 'axios';
import User from './class/User.class'
import Product from './class/Product.class'

Axios.interceptors.response.use( function ( response ) {
    const location = window.location.pathname
    const allow401 = ['/', '/login'];
    console.log( "Axios.interceptor", response )
    if( !( allow401.includes(location) ) && response?.status === 401 ) {
        /**@TODO create local logout when this happens to avoid unnecessary pinging of server*/
        window.location = "/logout"
    }
    return response;
}, function (error) {
    const location = window.location.pathname
    const allow401 = ['/', '/login'];
    console.log( "Axios.interceptor", {error} )
    if( !( allow401.includes(location) ) && error.response.status === 401 ) {
        window.location = "/logout"
    }
    return error;
})

export default class API {
    static Users = {
        addUser: async function ( data ) {
            try {
                const newUser = new User( data, 'create' );
                const result  = await newUser.post();
                console.log( result );
                return API.parseResponse( result );
                
            } 
            catch ( err ) {
                console.error( err )
                return {success: false, message: err}
            }
        },
        login: async function ( data ) {
            try {
                const user = new User( data, 'login' );
                const result = await user.post();
                console.log( result );
                return API.parseResponse( result );
                
            } 
            catch ( err ) {
                return {success: false, message: err}
            }
        },
        
        logout: async function ( data ) {
            try {
                const user = new User( data, 'logout' );
                const result = await user.post();
                console.log( result )
                return result;
            }
            catch ( err ) {
                console.error(err)
                return {success: false, message: err}
            }
        }
    }

    static Products = {
        getAll: async function ( data ) {
            try {
                const product = new Product ( data, 'getAll' );
                const result = await product.get();
                console.log( result )
                return API.parseResponse( result );
                
            }
            catch ( err ) {
                console.log( err )
                return {success: false, message: err}
            }
        },

        addProduct: async function ( data ) {
            try {
                const product = new Product ( data, 'create' );
                const result = await product.post();
                console.log( result );
                return API.parseResponse( result );
            }
            catch ( err ) {
                console.log( err )
                return {success: false, message: err}
            }
        },

        deleteProduct: async function ( data ) {
            try {
                const product = new Product ( data, 'delete' );
                const result = await product.delete();
                console.log( result );
                return API.parseResponse( result );
            }
            catch ( err ) {
                console.log( err )
                return {success: false, message: err};
            }
        }
    }

    static Conn = {
        test: async function ( data ) {
            try {
                const response = await Axios.get('/api-connection');
                return response;
            } 
            catch ( err ) {
                console.error( err );
                return err;
            }
        }
    }

    static parseResponse = ( response ) => {
        return {
            success: response?.data.success || response.success,
            data: response.data
        }
    }
}