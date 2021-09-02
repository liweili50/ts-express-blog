import morgan from "morgan"
import { createWriteStream } from 'fs'
import { join } from "path"

const accessLogStream = createWriteStream(join('./', 'access.log'), { flags: 'a' })

const loggerMiddleware = morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens['remote-addr'](req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
    ].join(' ')
}, { stream: accessLogStream })

export default loggerMiddleware
