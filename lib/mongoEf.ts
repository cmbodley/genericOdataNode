

import { MongoClient, ObjectID } from 'mongodb';
import { mongoDb, mongoUrl } from './config.json'

export class MongoAbstraction {

    dbConnection: any = null;
    url: string = `mongodb://${mongoUrl}/${mongoDb}`;
    public static client: MongoClient;

    constructor() {

    }

    async getItems(collection: string): Promise<any[]> {
        await MongoAbstraction.connect(this.url);
        const dbCollection = await this.getCollection(collection);
        const results = dbCollection.find().toArray();
        return await results;
    }

    async getItem(id: string, collection: string): Promise<any[]> {
        await MongoAbstraction.connect(this.url);
        const dbCollection = await this.getCollection(collection);
        const results = dbCollection.find({ "_id": new ObjectID(id) }).toArray();
        return await results;
    }

    async AddItem(item: any, collection: string) {
        await MongoAbstraction.connect(this.url);
        return await this.getCollection(collection).insertOne(item);
    }

    async EditItem(id: string, item: any, collection: string) {
        await MongoAbstraction.connect(this.url);
        return await this.getCollection(collection).updateOne({ "_id": new ObjectID(id) }, { $set: item })
    }

    async DeleteItem(id: string, collection: string) {
        await MongoAbstraction.connect(this.url);
        return await this.getCollection(collection).deleteOne({ "_id": new ObjectID(id) })
    }

    private getCollection(collection: string) {
        return MongoAbstraction.client.db(mongoDb).collection(collection);
    }


    private static connect(url: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client: MongoClient) => {
                if (err) {
                    reject(err);
                } else {
                    MongoAbstraction.client = client;
                    resolve(client);
                }
            });
        });
    }

    public disconnect(): Promise<void> {
        return MongoAbstraction.client.close();
    }



}