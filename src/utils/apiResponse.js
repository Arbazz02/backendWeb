class apiresponse{
    constructor(
        statusCode,
        message="Success",
        data,
    ){
        this.success=statusCode <400
        this.statusCode=statusCode;
        this.data=data;
        this.message=message
    }
}