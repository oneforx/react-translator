/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

 import * as express from 'express';
import * as cors from 'cors';
import ApiRouter from './app/router';

const app = express();

app.use(express.json())
app.use(cors())

app.use('/api', ApiRouter);

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
