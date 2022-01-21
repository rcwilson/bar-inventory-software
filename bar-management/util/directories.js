const path = require('path');

global.FILE_DB      = path.join(process.cwd(), '/util/db');

global.DIR_CLASS    = path.join(process.cwd(), '/class/');
global.DIR_ROUTES   = path.join(process.cwd(), '/routes/');
global.DIR_CONTROL  = path.join(process.cwd(), '/controllers/');