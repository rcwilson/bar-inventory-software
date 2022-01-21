import DataModel from './DataModel.class';

class Product extends DataModel {
    
    constructor( data, action ) {  
        
        super( data, action )

        if( data ) {
            this.name           = data.name;
            this.unit           = data.unit;
            this.category       = data.category;
            this.package_units  = data.package_units;
            this.package_type   = data.package_type;
            this.package_price  = data.package_price;
            this.distributor    = data.distributor;
        }
        
        this.setURL.create('/products/new', true)
        this.setURL.delete('/products/' + data?._id, true)
        this.setURL.getAll('/products', false)

        this.setSchema({
            _id: {
                type: String,
                required: () => ( this.action && this.action === 'edit' ),
            },
            name: {
                type: String,
                required: () => true
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
        })
    }
}

export default Product;