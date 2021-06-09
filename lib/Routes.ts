import { Request, Response } from "express";
import { mongoCollection } from "config.json";
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
                    message: 'Service Loaded Successfully'
                })
            });

        mongoCollection.forEach(collection => {
            if (collection === 'close' || collection === '' || collection === null || collection === undefined) {
                return;
            }

            // This application is supposed to be a micro service with a potential end point for odata
            app.route(`/${collection}`)
                // GET endpoint 
                .get(async (req: Request, res: Response) => {
                    // Get all items
                    const items = await this.service.getItems(collection)
                    res.status(200).send({
                        message: items
                    })
                    await this.service.disconnect();
                })
                // POST endpoint
                .post(async (req: Request, res: Response) => {
                    // add a new item
                    const item = await this.service.AddItem(req.body, collection);
                    res.status(200).send({
                        message: item
                    })
                    await this.service.disconnect();
                })

            // more detail
            app.route(`/${collection}/:_id`)
                // get specific item
                .get(async (req: Request, res: Response) => {
                    const item = await this.service.getItem(req.params['_id'], collection)
                    res.status(200).send({
                        message: item
                    })
                    await this.service.disconnect();
                })
                .put(async (req: Request, res: Response) => {
                    // Update an item
                    const item = await this.service.EditItem(req.params["_id"], req.body, collection);

                    res.status(200).send({
                        message: item
                    })
                })
                .delete(async (req: Request, res: Response) => {
                    // Delete an item
                    const item = await this.service.DeleteItem(req.params["_id"], collection);
                    res.status(200).send({
                        message: item
                    })
                })
        });
    }
}