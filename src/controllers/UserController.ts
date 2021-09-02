import { Router, Request, Response, NextFunction } from 'express'
import { query, validationResult } from 'express-validator'
import { ControllerBase } from 'types/index'
import { findByName } from '../models/user'
import { createSuccessResponseDTO, createClientErrorResponseDTO, createServiceErrorResponseDTO } from "../helpers"

class UserController implements ControllerBase {
    public path = '/'
    public router = Router()

    constructor() {
        this.initRoutes()
    }

    public initRoutes() {
        this.router.get('/user', query('name').exists(), this._handleClientError, this.index)
    }

    index(req: Request, res: Response) {
        let name = req.query.name
        findByName(name).then(data => {
            let result = createSuccessResponseDTO(data)
            res.json(result)
        }).catch(error => {
            let result = createServiceErrorResponseDTO(error)
            res.json(result)
        })
    }

    private _handleClientError(req: Request, res: Response, next: NextFunction) {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            let result = createClientErrorResponseDTO(errors.array())
            return res.json(result)
        } else {
            next()
        }
    }
}

export default UserController