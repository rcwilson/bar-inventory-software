const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Log } = require('../tools/dev-tools');
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async function(username) {
                Log.print().titled("user.class.js:10 ", "validate username: ", username)
                const user = await this.constructor.findOne({username});
                Log.print().titled("user.class.js:12 ", "compare user: ", username, user)
                if(user !== null) {
                    Log.print("if(user !== null): true")
                    if(this._id === user._id) {
                        Log.print("if(this._id === user._id): true")
                        return true
                    }
                    Log.print("if(this._id === user._id): true")
                    return false;
                } else {
                    Log.print("if(user !== null): false... return true;")
                    return true;
                }
            },
            message: '{VALUE} is already taken'
        }
    },
    password: {
        type: String,
        required: true,
    },
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
}, {timestamps: true, bufferCommands: false, autoCreate: true});

UserSchema.methods.hashPassword = async function() {
    Log.print().titled("user.class:40 hashPassword() called -- this:", this)
    if( !(this.password) ) return false;
    const result = await bcrypt.hash(this.password, 10)
    Log.print().titled("user.class:40 hashPassword() result- ", result)
    if(result !== this.password) {
        this.set({password: result});
        return true;
    }
    else return false;
}

UserSchema.post('save', function(err, doc, next) {
    Log.print().titled("user.class.js:55 UserSchema.post (err, doc, next)")
    if(err){
        Log.print().error("err: ", err)
        Log.print().error("doc: ", doc)
        Log.print().error("next: ", next?.toString())
        if (err.name === 'MongoError' && err.code === 11000) {
            next(new Error('username must be unique'))
            return err;
        } else {
            next(err)
            return err;
        }
    } else {
        next();
    }
})

module.exports = mongoose.model("User", UserSchema)
