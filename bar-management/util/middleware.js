const Log = require("../tools/Log");

async function validateUserSession( req, res, next ) {
    Log.print("middleware.js req.url", typeof req.url, Log.fc.yel(req.url));
    Log.print("middleware.js req.user", typeof req.user?.username, Log.fc.grn(req.user)) ;
    switch ( req.url ) {
        case "/login":
        case "/logout":
        case "/user/new":
        case "/api-connection":
            next();
            break;
        default:
            if ( req.user === undefined ) {
                return res.sendStatus(401);
            }
            next();

    }
}

module.exports = {validateUserSession}