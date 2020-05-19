export interface settings {
    mongoDb: string;
    mongoCollection: string[];
    mongoUrl: string;
    portNumber: number;
}


export const applicationSettings : settings = {
    mongoDb: "testData",
    mongoCollection: ["testCollection", "cars"],
    mongoUrl: "localhost:88",
    portNumber: 3000
}