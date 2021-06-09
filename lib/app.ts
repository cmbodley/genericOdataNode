import * as express from "express";
import {json, urlencoded} from "body-parser";
import { Routes } from './Routes';

export class App {

    public app: express.Application;
    public routePrv: Routes = new Routes();

    constructor() {
        this.app = express();
        this.config();        
        this.routePrv.routes(this.app);   
    }

    private config(): void{
        // support application/json type post data
        this.app.use(json());
        //support application/x-www-form-urlencoded post data
        this.app.use(urlencoded({ extended: false }));
    }

}

