
import * as mongo from 'mongodb';

import { applicationSettings } from './config';
import { MongoError } from 'mongodb';

export class MongoAbstraction {

    dbConnection: any = null;
    url: string = `mongodb://${applicationSettings.mongoUrl}/${applicationSettings.mongoDb}`;
    public static client: mongo.MongoClient;

    constructor() {

    }
    
    async getItems(collection: string): Promise<any[]> {
        await MongoAbstraction.connect(this.url);
        const dbCollection = await this.getCollection(collection);
        const results = dbCollection.find().toArray();        
        return await results;
    }

    async getItem(id:string, collection: string): Promise<any[]> {
        await MongoAbstraction.connect(this.url);
        const dbCollection = await this.getCollection(collection);
        const results = dbCollection.find({"_id": new mongo.ObjectId(id)}).toArray();        
        return await results;
    }

    async AddItem(item: any, collection: string) {
        await MongoAbstraction.connect(this.url);        
        return await this.getCollection(collection).insertOne(item);        
    }

    async EditItem(id: string,item: any, collection: string){
        await MongoAbstraction.connect(this.url);    
        return await this.getCollection(collection).updateOne({"_id": new mongo.ObjectId(id)}, {$set: item})
    }

    async DeleteItem(id: string, collection: string){
        await MongoAbstraction.connect(this.url);        
        return await this.getCollection(collection).deleteOne({"_id": new mongo.ObjectId(id)})
    }

    private getCollection(collection: string){
        return MongoAbstraction.client.db(applicationSettings.mongoDb).collection(collection);
    }


    private static connect(url: string): Promise<any> {
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

    public disconnect(): Promise<void> {
        return MongoAbstraction.client.close();
    }



}