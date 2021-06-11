import {
    Content,
    Info,
    ObjectType,
    RefLink,
    RequestBodySwag,
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
                    } as ObjectType,
                    "count":{
                        "anyOf":[
                           {
                              "type":"integer",
                              "minimum":0
                           },
                           {
                              "type":"string"
                           }
                        ],
                        "description":"The number of entities in the collection. Available when using the [$count](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_SystemQueryOptioncount) query option."
                     }
                },
                "parameters":{
                    "top":{
                       "name":"$top",
                       "in":"query",
                       "description":"Show only the first n items, see [Paging - Top](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_SystemQueryOptiontop)",
                       "schema":{
                          "type":"integer",
                          "minimum":0
                       },
                       "example":50
                    },
                    "skip":{
                       "name":"$skip",
                       "in":"query",
                       "description":"Skip the first n items, see [Paging - Skip](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_SystemQueryOptionskip)",
                       "schema":{
                          "type":"integer",
                          "minimum":0
                       }
                    },
                    "count":{
                       "name":"$count",
                       "in":"query",
                       "description":"Include count of items, see [Count](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_SystemQueryOptioncount)",
                       "schema":{
                          "type":"boolean"
                       }
                    },
                    "search":{
                       "name":"$search",
                       "in":"query",
                       "description":"Search items by search phrases, see [Searching](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_SystemQueryOptionsearch)",
                       "schema":{
                          "type":"string"
                       }
                    }
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
                const body = b === 'put';
                pathItem[b] = {
                    operationId: `${b}${a}`,
                    parameters: [this.getIdParameter(true)],
                    summary: `This action ${this.getAction(b)} for the ${a} Repository`,
                    responses: {
                        "200": {
                            description: "200 response",
                            content: this.getEmptyResponse()
                        } as SwagResponse
                    },
                    requestBody: body ? {
                        description: `This is just an object end point uses to create or update the document.`,
                        required: true,
                        content: this.getEmptyResponse()
                    } as RequestBodySwag : undefined
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
            } as Verbs

            const postItem = {
                operationId: `getsAll${a}`,
                summary: `This action ${this.getAction('get')} for the ${a} Repository`,
                responses: {
                    "200": {
                        description: "200 response",
                        content: this.getEmptyResponse()
                    } as SwagResponse
                },
                requestBody: {
                    description: `This is just an object end point uses to create or update the document.`,
                    required: true,
                    content: this.getEmptyResponse()
                } as RequestBodySwag 
            } as Verbs

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
                        },
                        requestBody: {
                            description: `This is just an object end point uses to create or update the document.`,
                            required: true,
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "array",
                                        items: {
                                            "$ref": "#/components/schemas/emptyObject"
                                        } as any,
                                        nullable: true
                                    }
                                } as any
                            }
                        } as RequestBodySwag
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
                        },
                        "parameters":[
                            {
                               "$ref":"#/components/parameters/top"
                            },
                            {
                               "$ref":"#/components/parameters/skip"
                            },
                            {
                               "$ref":"#/components/parameters/search"
                            },
                            {
                               "name":"$filter",
                               "description":"Filter items by property values, see [Filtering](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_SystemQueryOptionfilter)",
                               "in":"query",
                               "schema":{
                                  "type":"string"
                               }
                            },
                            {
                               "$ref":"#/components/parameters/count"
                            },
                            {
                               "name":"$orderby",
                               "description":"Order items by property values, see [Sorting](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_SystemQueryOptionorderby)",
                               "in":"query",
                               "explode":false,
                               "schema":{
                                  "type":"array",
                                  "uniqueItems":true,
                                  "items":{
                                     "type":"string",
                                     "enum":[
                                        "CustomerID",
                                        "CustomerID desc",
                                        "CompanyName",
                                        "CompanyName desc",
                                        "ContactName",
                                        "ContactName desc",
                                        "ContactTitle",
                                        "ContactTitle desc",
                                        "Address",
                                        "Address desc",
                                        "City",
                                        "City desc",
                                        "Region",
                                        "Region desc",
                                        "PostalCode",
                                        "PostalCode desc",
                                        "Country",
                                        "Country desc",
                                        "Phone",
                                        "Phone desc",
                                        "Fax",
                                        "Fax desc"
                                     ]
                                  }
                               }
                            },
                            {
                               "name":"$select",
                               "description":"Select properties to be returned, see [Select](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_SystemQueryOptionselect)",
                               "in":"query",
                               "explode":false,
                               "schema":{
                                  "type":"array",
                                  "uniqueItems":true,
                                  "items":{
                                     "type":"string",
                                     "enum":[
                                        "CustomerID",
                                        "CompanyName",
                                        "ContactName",
                                        "ContactTitle",
                                        "Address",
                                        "City",
                                        "Region",
                                        "PostalCode",
                                        "Country",
                                        "Phone",
                                        "Fax"
                                     ]
                                  }
                               }
                            },
                            {
                               "name":"$expand",
                               "description":"Expand related entities, see [Expand](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_SystemQueryOptionexpand)",
                               "in":"query",
                               "explode":false,
                               "schema":{
                                  "type":"array",
                                  "uniqueItems":true,
                                  "items":{
                                     "type":"string",
                                     "enum":[
                                        "*",
                                        "Orders",
                                        "CustomerDemographics"
                                     ]
                                  }
                               }
                            }
                         ],
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


