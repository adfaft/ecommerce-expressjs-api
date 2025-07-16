export class ErrorMessage extends Error{

    prev:Error|null = null;

    constructor(message: string, prev: Error|null = null){
        super(message);
        this.prev = prev;
    }
}

export class ErrorStatus extends ErrorMessage{

    status:number = 0;

    constructor(status:number, message: string, prev: Error|null = null){
        super(message, prev);
        this.status = status;
    }

}


export default ErrorMessage;