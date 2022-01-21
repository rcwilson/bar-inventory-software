class Log {
    
    constructor(...printArgs)
    {
        this.showStack = false;
        this.DEBUG = DEBUG;

        if( printArgs.length > 0 ) {
            this.print(printArgs);
        }
    }

    fc = {
        blk : (string) => "\x1b[30m"+string+this.fc.esc,
        red : (string) =>  "\x1b[31m"+string+this.fc.esc,
        grn : (string) => "\x1b[32m"+string+this.fc.esc,
        yel : (string) => "\x1b[33m"+string+this.fc.esc,
        blu : (string) => "\x1b[34m"+string+this.fc.esc,
        mag : (string) => "\x1b[35m"+string+this.fc.esc,
        cyn : (string) => "\x1b[36m"+string+this.fc.esc,
        wht : (string) => "\x1b[37m"+string+this.fc.esc,
        esc : "\x1b[0m",
    }

    stack(){
        this.showStack = true;
        return this;
    }

    resetOptions(){
        this.showStack = false;
    }

    print(...args){
        if(!this.DEBUG) return;
        if(this.showStack) console.trace("Log Trace");
        if(args?.length > 0) console.log(...args);
        this.resetOptions();
        
        let self = this;
        function title(...args){
            args[0] = self.fc.yel(args[0]);
            self.print(...args);
        }
        function error(...args){
            args[0] = self.fc.red(args[0]);
            self.print(...args);
        }
        function success(...args){
            args[0] = self.fc.grn(args[0]);
            self.print(...args);
        }
        const options = {
            titled: (...args) => title(...args),
            error: (...args) => error(...args),
            success: (...args) => success(...args),
        }
        
        return options;
    }


}

module.exports = new Log();