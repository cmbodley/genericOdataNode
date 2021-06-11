export interface Contact {
    name: string;
    url: string;
    email: string;
}

export interface License {
    name: string;
    url: string;
}

export interface Info {
    title: string;
    description: string;
    termsOfService: string;
    contact: Contact;
    license: License;
    version: string;
}

export interface Server {
    url: string;
    description: string;
}

export interface Info {
    title: string;
    version: string;
}

export interface Link {
    href: string;
    rel: string;
}

export interface Version {
    status: string;
    updated: Date;
    id: string;
    links: Link[];
}

export interface RootObject {
    openapi: string;
    info: Info;
    paths: any;
    components: any;  
}

export interface Verbs {
    operationId:string;
    summary:string;
    requestBody: RequestBodySwag;
    responses: any;
    parameters: SwaggerParameter[];
}

export interface SwagResponse {
    description: string;
    content: any;
}

export interface Content {
    "application/json":SchemaLink;   
}

export interface SchemaLink {
    schema:RefLink;
}

export interface RefLink {
    "$ref":string;
}

export interface ObjectType {
    type: string;
    properties: any;
}

export interface SwaggerParameter {
    name:string;
    in: string;
    required: boolean;
    allowEmptyValue: boolean;
}

export interface RequestBodySwag {
    description: string;
    required: boolean;
    content: any;
}