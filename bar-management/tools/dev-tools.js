const Log = require("../tools/Log");

class DevTools {
    constructor()
    {
        this.Log = Log;
    }
}

module.exports = new DevTools();