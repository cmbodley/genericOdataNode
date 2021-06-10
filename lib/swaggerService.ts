import { mongoCollection } from "./config.json";
import { Content, Info, ObjectType, RefLink, RootObject, SchemaLink, SwaggerParameter, SwagResponse, Verbs } from './swagger-interfaces/info'
export class SwaggerService {

    private baseUrl: string;
    private collections: string[];
    public swagger: RootObject;

    constructor(url: string) {
        this.baseUrl = url;
        this.collections = mongoCollection;
        this.swagger = {
            openapi: "3.0.0",
            info: {
                title: "Generic API Repostory",
                description: "A mongodb backed Repository for general data store",
                version: "v1"
            } as Info,
            paths: {} as any,
            components: {
                schemas: {
                    emptyObject: {
                        type: "object",
                        properties: {}
                    } as ObjectType
                }
            } as any
        } as RootObject;

        this.setupBasicPaths();
        this.setupCollectionPaths();
    }

    setupBasicPaths() {
        this.swagger.paths["/"] = {
            "get": {
                operationId: "getRootMessage",
                summary: "Gets the default root message",
                responses: {
                    "200": {
                        description: "200 response",
                        content: this.getEmptyResponse()
                    } as SwagResponse
                }
            } as Verbs
        } as any;

        this.swagger.paths['/swaggerjson'] = {
            "get": {
                operationId: "getSwaggerJson",
                summary: "Gets the swagger json file usefull for angular service updates or for updating the json file so swagger documents the api",
                responses: {
                    "200": {
                        description: "200 response",
                        content: this.getEmptyResponse()
                    } as SwagResponse
                }
            } as Verbs
        } as any;

    }

    getEmptyResponse() {
        return {
            "application/json": {
                schema: {
                    "$ref": "#/components/schemas/emptyObject"
                } as RefLink
            } as SchemaLink
        } as Content
    }

    getIdParameter(required: boolean){
        return {
            name:"id",
            in:"path",
            required: required,
            allowEmptyValue: required          
        } as SwaggerParameter;
    }

    setupCollectionPaths() {        
        this.collections.forEach(a => {
            const basicItems = ['get', 'post', 'put', 'delete'];
            const pathItem = {} as any;                
            basicItems.forEach(b => {                
                pathItem[b] = {
                    operationId: `${b}${a}`,
                    parameters:[this.getIdParameter(true)],
                    summary: `This action ${this.getAction(b)} for the ${a} Repository`,
                    responses: {
                        "200": {
                            description: "200 response",
                            content: this.getEmptyResponse()
                        } as SwagResponse
                    }
                } as Verbs
            });

            

            this.swagger.paths[`/${a}/{id}`] = pathItem;
            //add the other get         



        });

        // this.collections.forEach(a => {
        //     const advancedItems = ['list', 'odata'];
        // })      
    }

    getAction(verb: string){
        switch(verb){
            case 'get':
                return 'Query(s)';
            case 'post':
                return 'Add(s)';
            case 'put':
                return 'Edit(s)';
            case 'delete':
                return 'Delete(s)';
        }
    }
}


