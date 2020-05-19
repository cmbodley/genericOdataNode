import { Request, Response } from "express";
import { applicationSettings } from './config';
import { MongoAbstraction } from './mongoEf';

export class Routes {

    private service: MongoAbstraction;

    constructor() {
        this.service = new MongoAbstraction();
    }

    public routes(app): void {
        app.route('/')
            .get((req: Request, res: Response) => {
                res.status(200).send({
                    message: 'GET request successfulll!!!!'
                })
            })

        // This application is supposed to be a micro service with a potential end point for odata
        app.route(`/${applicationSettings.mongoCollection}`)
            // GET endpoint 
            .get((req: Request, res: Response) => {
                // Get all items
                res.status(200).send({
                    message: 'GET request successfulll!!!!'
                })
            })
            // POST endpoint
            .post((req: Request, res: Response) => {
                // add a new item
                this.service.AddItem(req.body);
                res.status(200).send({
                    message: 'POST request successfulll!!!!'
                })
            })

        // more detail
        app.route(`/${applicationSettings.mongoCollection}/:_id`)
            // get specific item
            .get((req: Request, res: Response) => {                
                res.status(200).send({
                    message: "arrrg"
                })
            })
            .put((req: Request, res: Response) => {
                // Update an item
                res.status(200).send({
                    message: 'PUT request successfulll!!!!'
                })
            })
            .delete((req: Request, res: Response) => {
                // Delete an item
                res.status(200).send({
                    message: 'DELETE request successfulll!!!!'
                })
            })
    }
}