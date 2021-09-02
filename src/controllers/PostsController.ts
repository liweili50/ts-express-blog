import { NextFunction, Request, Response, Router } from 'express'
import { body,query, validationResult } from 'express-validator'
import { ControllerBase, PostNode, PostSchema } from '../types'
import { createPost, getPostById, getPostsByTag, getPostsList, getTagsList, getArchiveList } from "../models/posts"
import { createClientErrorResponseDTO, createServiceErrorResponseDTO, createSuccessResponseDTO } from "../helpers/index"

class PostsController implements ControllerBase {
    public path = '/posts'
    public router = Router()
    constructor() {
        this.initRoutes()
    }

    public initRoutes() {
        this.router.post(`${this.path}/createPost`, [body('content').exists(), body('title').exists()], this.creatPost)
        this.router.get(`${this.path}/getPostsList`, [query('pageNum').isInt(), query('pageSize').isInt()], this._handleClientError, this.getPostsList)
        this.router.get(`${this.path}/getPostsByTag`, query('tag').exists().notEmpty(), this._handleClientError, this.getPostsByTag)
        this.router.get(`${this.path}/getPostById`, query('id').exists().notEmpty(), this._handleClientError, this.getPostById)
        this.router.get(`${this.path}/getTagsList`, this.getTagsList)
        this.router.get(`${this.path}/getArchiveList`, this.getArchiveList)
    }

    creatPost(req: Request, res: Response) {
        createPost(req.body).then(data => {
            let result = createSuccessResponseDTO(data)
            res.json(result)
        }).catch(error => {
            let result = createServiceErrorResponseDTO(error)
            res.json(result)
        })
    }
    getPostsList(req: Request, res: Response) {
        let query = req.query
        getPostsList(query).then(data => {
            let result = createSuccessResponseDTO(data)
            res.json(result)
        }).catch(error => {
            let result = createServiceErrorResponseDTO(error)
            res.json(result)
        })
    }

    getTagsList(req: Request, res: Response) {
        getTagsList().then(data => {
            let result = createSuccessResponseDTO(data)
            res.json(result)
        }).catch(error => {
            let result = createServiceErrorResponseDTO(error)
            res.json(result)
        })
    }

    getPostsByTag(req: Request, res: Response) {
        let tag = req.query.tag
        getPostsByTag(tag).then(data => {
            let result = createSuccessResponseDTO(data)
            res.json(result)
        }).catch(error => {
            let result = createServiceErrorResponseDTO(error)
            res.json(result)
        })
    }

    getPostById(req: Request, res: Response) {
        let id = req.query.id
        getPostById(id).then(data => {
            let result = createSuccessResponseDTO(data)
            res.json(result)
        }).catch(error => {
            let result = createServiceErrorResponseDTO(error)
            res.json(result)
        })
    }

    getArchiveList(req: Request, res: Response) {
        getArchiveList().then(data => {
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

export default PostsController