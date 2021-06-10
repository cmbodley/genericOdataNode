

import { MongoClient, ObjectID } from 'mongodb';
import { FilterQuery } from 'mongoose';
import { mongoDb, mongoUrl } from './config.json'

export class MongoAbstraction {

    dbConnection: any = null;
    url: string = `mongodb://${mongoUrl}/${mongoDb}`;
    public static client: MongoClient;

    constructor() {

    }

    async queryItems(collection: string, query: FilterQuery<any>) : Promise<any[]> {
        await MongoAbstraction.connect(this.url);
        const dbCollection = await this.getCollection(collection);
        const results = dbCollection
            .find(query.query)
            .project(query.projection)
            .sort(query.sort)
            .skip(query.skip ?? 0)
            .limit(query.limit ?? 100)
            .toArray();
        return await results;
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

    async addItem(item: any, collection: string) {
        await MongoAbstraction.connect(this.url);
        return await this.getCollection(collection).insertOne(item);
    }

    async editItem(id: string, item: any, collection: string) {
        await MongoAbstraction.connect(this.url);
        const newItem = this.safeConvert(item);
        return await this.getCollection(collection).updateOne({ "_id": new ObjectID(id) }, { $set: newItem })
    }

    safeConvert(item: any): any {
        const keys = Object.keys(item);
        let newObj = {};
        keys.forEach(a => {
            if(a !== "_id"){
                newObj[a] = item[a];
            }
        });
        console.log(newObj);
        return newObj;
    }

    async deleteItem(id: string, collection: string) {
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