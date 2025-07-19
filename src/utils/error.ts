export class ErrorMessage extends Error{

    prev:Error|null = null;
    error:any = {};

    constructor(message: string, error: any = {}, prev: Error|null = null){
        super(message);
        this.error = error;
        this.prev = prev;
    }
}

export class ErrorStatus extends ErrorMessage{

    status:number = 0;

    constructor(status:number, message: string, error: any = {}, prev: Error|null = null){
        super(message, error, prev);
        this.status = status;
    }

}


export default ErrorMessage;