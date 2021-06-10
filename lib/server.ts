import {App} from "./app";
import {portNumber} from "./config.json";
import * as swaggerUi from 'swagger-ui-express';
import * as swagJson from "./swagger.json"; 

const PORT = portNumber;
const app = new App().app;

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swagJson));

app.listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
})