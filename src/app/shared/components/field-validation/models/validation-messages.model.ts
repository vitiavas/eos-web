import { ValidationTypeEnum } from "./validation-type.enum";

export class ValidationsMessages {
    type: ValidationTypeEnum;
    message: string;

    constructor(type: ValidationTypeEnum, message: string) {
       this.type = type;
       this.message = message;
        
    }
}
