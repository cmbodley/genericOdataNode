
import * as mongo from 'mongodb';

import { applicationSettings } from './config';
import { MongoError } from 'mongodb';

export class MongoAbstraction {

    dbConnection: any = null;
    url: string = `mongodb://${applicationSettings.mongoUrl}/${applicationSettings.mongoDb}`;
    public static client: mongo.MongoClient;


    constructor() {

    }

    async AddItem(item: any, collection: string = applicationSettings.mongoCollection) {
        const connection = await MongoAbstraction.connect(this.url);
        console.log('connected', item);
        await MongoAbstraction.client.db(applicationSettings.mongoDb).collection(collection).insertOne(item);
    }


    public static connect(url: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            mongo.MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client: mongo.MongoClient) => {
                if (err) {
                    reject(err);
                } else {
                    MongoAbstraction.client = client;
                    resolve(client);
                }
            });
        });
    }

    public disconnect(): void {
        MongoAbstraction.client.close();
    }



}