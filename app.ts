import dotenv from 'dotenv';
import App from "./src/core/server";
dotenv.config();

const app = new App();

app.listen();