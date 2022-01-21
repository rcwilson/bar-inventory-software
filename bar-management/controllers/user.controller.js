const User = require('../class/user.class');
const passport = require('passport');
const Log = require('../tools/Log');

module.exports = {

    async findOne(req, res) {
        let response = { success: true };
        try {
            const user = User.findOne({username: req.body.username})
            response.user = user;
        }
        catch (error) {
            response.success = false;
            response.message = error;
        }
        finally {
            return res.send(response)
        }
    },

    async addNewUser(req, res) {
        const data = req.body;
        const user = new User(data);
        const hashResult = await user.hashPassword();
        Log.print().titled("user.controller.js addNewUser():17 ", user)

        if(hashResult) {
            Log.print().titled("user.controller.js:18 hashPassword() result:", hashResult)
            user.save()
                .then(response => {
                    Log.print().titled("user.controller.js: 22 " , " user.save(data) response: " , response);
                    return res.send({success: true, message: "New user created", user: response})
                })
                .catch(err => {
                    Log.print().titled("user.controller.js: 26 " , " user.save(data) catch(err): " , err);
                    return res.send({success: false, message: "Unsuccessful in creating user.", error: err?.message})
                })
        } else {
            return res.send({success: false, message: "Server Error: Error building new user"})
        }
    },

    login(req, res, next) {
        Log.print().titled("user.controller - login() req.body", req.body);
        passport.authenticate("local", (err, user, info) => {
            if (!user) res.send({success: false, message: "Invalid Credentials", err: err ?? null})
            else {
                req.logIn(user, (err) => {
                    if (err) throw err;
                    Log.print(user);
                    const userData = {username: user.username, first_name: user.first_name}
                    res.send({success: true, message: "Authenticated", user: userData})
                })
            }
        })(req, res, next);
    },

    logout( req, res, next ) {
        req.logout();
        res.send({ success: true })
    }

}