const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const assert = require('assert');

const config = require('../config.json');
const url = config.database.url + "/" + config.database.name

const User = require('../class/user.class');
const Product = require('../class/product.class');
const Log = require('../tools/Log');
const { schema } = require('../class/product.class');

class MongoUtil {
    constructor() {
        this.client = new MongoClient(config.database.url);
        
    }
    
    async connect() {
        await this.client.connect();
        console.log("Connected to Database")
        await mongoose.connect(url);
        Log.print().titled("mongoose modelNames", mongoose.modelNames())
        // Log.print().titled("mongoose schema.paths", schema.paths)

        this.db      = this.client.db('bar-inventory-dev');
        // this.User    = User;
        // this.Product = Product;

    }
}

module.exports = new MongoUtil();
