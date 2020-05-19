import app from "./app";
import { applicationSettings } from './config';

const PORT = applicationSettings.portNumber;

app.listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
})