import app from "./app";
import * as applicationSettings from "./config.json";

const PORT = applicationSettings.portNumber;

app.listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
})