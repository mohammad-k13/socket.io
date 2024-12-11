import express from 'express';

import { config } from 'dotenv';
import cors from 'cors'
import bodyParser from 'body-parser';

config();
const app = express();

app.use(cors())
app.use(bodyParser({extended: true}));

