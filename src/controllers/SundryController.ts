import { Router, Request, Response } from 'express'
import superagent from 'superagent'
import dayjs from 'dayjs'
import { ControllerBase } from 'types/index'
import { createSuccessResponseDTO, createServiceErrorResponseDTO } from "../helpers"

class SundryController implements ControllerBase {
    public path = '/sundry'
    public router = Router()
    private bingDailyImage: { startdate: string, enddate: string, url: string }
    constructor() {
        this.initRoutes()
    }

    public initRoutes() {
        this.router.get('/sundry/getBingDailyImage', this.getBingDailyImage.bind(this))
    }

    getBingDailyImage(req: Request, res: Response) {
        const Domain = 'https://cn.bing.com'
        if (this.bingDailyImage && dayjs().isBefore(this.bingDailyImage.startdate) && dayjs().isAfter(this.bingDailyImage.enddate)) {
            let result = createSuccessResponseDTO(this.bingDailyImage)
            return res.json(result)
        }
        superagent.get(`${Domain}/HPImageArchive.aspx?format=js&idx=0&n=1&pid=hp&nc= ${new Date().getTime()}`)
            .end((error: Error, data: { text: string }) => {
                if (error) {
                    let result = createServiceErrorResponseDTO(error)
                    return res.json(result)
                }
                this.bingDailyImage = JSON.parse(data.text).images[0]
                this.bingDailyImage.url = `${Domain}` + this.bingDailyImage.url
                let result = createSuccessResponseDTO(this.bingDailyImage)
                res.json(result)
            });
    }
}

export default SundryController
