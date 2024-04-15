class apiErrorHandler extends Error{
    constructor(
        statusCode,
        message="server error, something went wrong",
        errors=[],
        stack=""
    ){
        super(message)
        this.statusCode=statusCode
        this.message=message
        this.errors=errors
        this.success=false
        this.stack=stack
        this.data=null

        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this,this.constructor)
            //capturestacktrance mei wos ka instance pass kar diye hai ki aabi aap kis costent mai baat kar rahe ho 
        }
    }
}

export {apiErrorHandler}