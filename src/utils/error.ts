export class ErrorMessage extends Error{

    trace:any = null;

    constructor(message: string, trace: any|null = null){
        super(message);
        this.trace = trace;
    }
}

export class ErrorStatus extends ErrorMessage{

    status:number = 0;

    constructor(status:number, message: string, trace: any|null = null){
        super(message, trace);
        this.status = status;
    }

}


export default ErrorMessage;