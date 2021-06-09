import {App} from "./app";
import {portNumber} from "./config.json";

const PORT = portNumber;
const app = new App().app;

app.listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
})