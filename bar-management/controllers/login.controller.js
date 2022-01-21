const  {Users}  = require(FILE_DB);

module.exports = {

    async login (req, res) {
        const data = req.body ?? false;
        if(DEBUG) console.log("login.controller.login: ", data)
        if(data) {
            const response = await Users.login(req.body);
            res.json(response)
        } else {
            res.json({
                success: "false",
                message: "Empty Body in request"
            })
        }
    }
}