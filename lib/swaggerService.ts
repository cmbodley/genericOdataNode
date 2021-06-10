import { 
    Content, 
    Info, 
    ObjectType, 
    RefLink, 
    RootObject, 
    SchemaLink, 
    SwaggerParameter, 
    SwagResponse, 
    Verbs 
} from './swagger-interfaces/info';

export class SwaggerService {
    
    private collections: string[];
    public swagger: RootObject;

    constructor(collection: string[]) {        
        this.collections = collection;
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

    getIdParameter(required: boolean) {
        return {
            name: "id",
            in: "path",
            required: required,
            allowEmptyValue: required
        } as SwaggerParameter;
    }

    setupCollectionPaths() {
        this.collections.forEach(a => {
            const basicItems = ['get', 'put', 'delete'];
            const pathItem = {} as any;
            basicItems.forEach(b => {
                pathItem[b] = {
                    operationId: `${b}${a}`,
                    parameters: [this.getIdParameter(true)],
                    summary: `This action ${this.getAction(b)} for the ${a} Repository`,
                    responses: {
                        "200": {
                            description: "200 response",
                            content: this.getEmptyResponse()
                        } as SwagResponse
                    }
                } as Verbs
            });



            const getItem = {
                operationId: `getsAll${a}`,
                summary: `This action ${this.getAction('get')} for the ${a} Repository`,
                responses: {
                    "200": {
                        description: "200 response",
                        content: this.getEmptyResponse()
                    } as SwagResponse
                }
            }

            const postItem = {
                operationId: `getsAll${a}`,
                summary: `This action ${this.getAction('get')} for the ${a} Repository`,
                responses: {
                    "200": {
                        description: "200 response",
                        content: this.getEmptyResponse()
                    } as SwagResponse
                }
            }

            this.swagger.paths[`/${a}/{id}`] = pathItem;
            this.swagger.paths[`/${a}`] = {
                'get': getItem,
                'post': postItem
            }
        });

        this.collections.forEach(a => {
            const advancedItems = ['list', 'odata'];
            advancedItems.forEach(b => {
                const pathItem = {} as any;
                if (b == 'list') {
                    pathItem['post'] = {
                        operationId: `post${a}${b}`,
                        summary: `Adds an array of objects to the ${a} Collection`,
                        responses: {
                            "200": {
                                description: "200 response",
                                content: this.getEmptyResponse()
                            } as SwagResponse
                        }
                    } as Verbs
                } else {
                    pathItem['get'] = {
                        operationId: `get${a}${b}`,
                        summary: `An Odata Endpoint to query items form ${a} Collection`,
                        responses: {
                            "200": {
                                description: "200 response",
                                content: this.getEmptyResponse()
                            } as SwagResponse
                        }
                    } as Verbs                 
                }

                this.swagger.paths[`/${a}/${b}`] = pathItem
            });
        })
    }

    getAction(verb: string) {
        switch (verb) {
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


