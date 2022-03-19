const Product = require('../class/product.class');
const User = require('../class/user.class')
const Log = require('../tools/Log');

module.exports = {

    async findAll(req, res) {
        let response = {success: true}
        try {
            Log.print(`product.controller: populate model name: ${User.modelName}`)
            let products = await Product.find().populate({path: "created_by", select: "username first_name"})
            response.products = products;
            Log.print("product.controller: Find (count)", products?.length)
            Log.print(`product.controller: populate products[${products.length - 1}]`, products[products.length - 1])
        }
        catch (error) {
            Log.print().error("product.populate", error)
            response.success = false;
            response.message = error
        }
        finally {
            return res.send(response);
        }
    },

    async addNewProduct(req, res) {
        Log.print().titled("product.controller.js req.user", req.user)
        let response = {success: true}
        try {
            let data = req.body;
            Log.print().titled("product.controller.js req.body", req.body)
            if(req.user) {
                data.created_by = req.user._id;
            } else {
                Log.print().error("product.controller addNewProduct", "message: No user session established")
                throw new Error("No user session established")
            }
            const product = new Product(data);
            const result = await product.save();
            response.data = result;
            Log.print().titled("Product.controller.js addNewProduct(): ", product)
        }
        catch(error) {
            response.message = error;
            response.success = false;
            Log.print().error("product.save() error", error)
        }
        finally{
            return res.send(response);
        }
    },

    async deleteProduct(req, res) {
        Log.print( Log.fc.red( 'Delete Product: (params) ', Log.fc.wht( req.params?._id )));
        let response = {success: true}
        const _id = req.params._id;
        if( (!_id) || _id === null ) return res.send({success: false, message: "_id required"})
        try {
            const result = await Product.deleteOne({_id: _id});
            response.data = result;
            Log.print(Log.fc.yel(result));
        } catch (error) {
            response.message = error;
            response.success = false;
        } finally {
            return res.send(response);
        }
    },
    
    async editProduct(req, res) {
        Log.print( Log.fc.cyn( 'Edit Product: ', Log.fc.wht( req.params?._id, req.body )));
        let response = { success: true, message: "" };
        const _id = req.params._id;
        if( (!_id) || _id === null ) {
            console.error("_id missing for Edit Product");
            response.success = false;
            response.message = "_id of product missing";
            return res.send( response );
        } 
        try {
            const result = await Product.findByIdAndUpdate( _id, req.body );
            console.log("edit product result: ", result)
            response.message = "Success";
        } catch (error) {
            response.message = error;
            response.success = false;
        } finally {
            return res.send( response );
        }
    }
}