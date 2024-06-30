class ApiError extends Error {
    constructor(
        statusCode,
        message="Someting went wrong",
        errors=[],
        stack=""

    ) {
        this.data=null
        super(message);
        this.statusCode = statusCode
        this.message = message
        this.errors = errors
        this.success=false


        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }

    }   
}




export {ApiError}