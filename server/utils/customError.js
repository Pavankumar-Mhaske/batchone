
class CustomError extends Error {
    constructor(message, code){
        super(massaage);
        this.code = code;
    }
}

export default CustomError;