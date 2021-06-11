import { SwaggerService } from "./swaggerService";
import { writeFileSync } from 'fs';
import * as p from 'path';
import * as config from './config.json';

// update the config
const repos = process.env.REPOS;
const dbName = process.env.DBNAME;

const newConfig = {
    mongoDb: config.mongoDb,    
    mongoUrl: config.mongoUrl,
    portNumber: config.portNumber,
    mongoCollection: [] as string[]
} as any;


if(repos !== null && repos !== undefined){
    const repoItems = repos.split(',');
    newConfig['mongoCollection'] = repoItems;
    newConfig['mongoDb'] = dbName;
    writeFileSync(`${p.join(__dirname,'config.json')}`, JSON.stringify(newConfig), {encoding:'utf8', flag:'w'});
}


// update the swagger
const swagJson = new SwaggerService(newConfig.mongoCollection);
const swag = swagJson.swagger;
writeFileSync(`${p.join(__dirname,'swagger.json')}`, JSON.stringify(swag), {encoding:'utf8', flag:'w'});

