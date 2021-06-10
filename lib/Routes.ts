import { Request, Response } from "express";
import { mongoCollection } from "./config.json";
import { MongoAbstraction } from './mongoEf';
import { createFilter, createQuery } from "odata-v4-mongodb";

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

        app.route('/test')
        .get((req: Request, res: Response) =>{
            const query = req.url.split('?');
            const createdQuery = createQuery(query[1]);
            res.status(200).send({
                message: createdQuery
            })
        });




        mongoCollection.forEach(collection => {
            if (collection === 'close' || collection === '' || collection === null || collection === undefined) {
                return;
            }

            app.route(`/${collection}/odata/`)
                .get(async (req: Request, res: Response) => {
                    const filterQuery = req.url.split('?');  
                    

                    if (filterQuery === null || filterQuery === undefined || filterQuery.length <= 1) {
                        const items = await this.service.getItems(collection)
                        res.status(200).send({
                            body: items
                        })
                    } else {
                        const query = createQuery(filterQuery[1]);
                        const items = await this.service.queryItems(collection, query);
                        res.status(200).send({
                            body: items
                        });
                    }
                    await this.service.disconnect();
                });

            // This application is supposed to be a micro service with a potential end point for odata
            app.route(`/${collection}`)
                // GET endpoint 
                .get(async (req: Request, res: Response) => {
                    // Get all items
                    const items = await this.service.getItems(collection)
                    res.status(200).send({
                        body: items
                    })
                    await this.service.disconnect();
                })
                // POST endpoint
                .post(async (req: Request, res: Response) => {
                    // add a new item
                    const item = await this.service.addItem(req.body, collection);
                    res.status(200).send({
                        body: item
                    })
                    await this.service.disconnect();
                });

            app.route(`/${collection}/list/`)
            .post(async (req: Request, res:Response) => {
                if(req.body !== null && req.body !== undefined){
                    const items = req.body as [];
                    if(items.length > 0){
                        items.forEach(async a => {
                            await this.service.addItem(a, collection);
                        });
                    }
                }
                res.status(200).send({
                    body: "items added successfull"
                })
                await this.service.disconnect();                
            });

            // more detail
            app.route(`/${collection}/:_id`)
                // get specific item
                .get(async (req: Request, res: Response) => {
                    const item = await this.service.getItem(req.params['_id'], collection)
                    res.status(200).send({
                        body: item
                    })
                    await this.service.disconnect();
                })
                .put(async (req: Request, res: Response) => {
                    // Update an item
                    const item = await this.service.editItem(req.params["_id"], req.body, collection);

                    res.status(200).send({
                        body: item
                    })
                })
                .delete(async (req: Request, res: Response) => {
                    // Delete an item
                    const item = await this.service.deleteItem(req.params["_id"], collection);
                    res.status(200).send({
                        body: item
                    })
                });
        });
    }
}