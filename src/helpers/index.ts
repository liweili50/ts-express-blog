import { ValidationError } from 'express-validator';
import { ResponseWarpper } from "../types"

class ClientErrorResponseDTO implements ResponseWarpper {
    public code: number
    public message: string
    constructor(error: ValidationError[]) {
        let { location, msg, param } = error[0]
        this.code = 400
        this.message = `${location}[${param}]: ${msg}`;
    }
}

class ServiceErrorResponseDTO implements ResponseWarpper {
    public code: number
    public message: string
    constructor(error: Error) {
        this.code = 500
        this.message = error.message
    }
}

class SuccessResponseDTO implements ResponseWarpper {
    public code: number
    public message: string
    public result: any
    constructor(result: any) {
        this.code = 200
        this.result = result
        this.message = 'success'
    }
}

export function createClientErrorResponseDTO(error: ValidationError[]): ResponseWarpper {
    return new ClientErrorResponseDTO(error)
}

export function createServiceErrorResponseDTO(error: Error): ResponseWarpper {
    return new ServiceErrorResponseDTO(error)
}

export function createSuccessResponseDTO(result: any): ResponseWarpper {
    return new SuccessResponseDTO(result)
}