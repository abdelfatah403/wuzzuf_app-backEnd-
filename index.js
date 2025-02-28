import  express from 'express'
import bootStrap from './src/app.controller.js'
import cleanupOTP from './src/utilis/cron/otpCron.js';
import { Socket } from 'socket.io'
const app = express()
const port = 3000

cleanupOTP.start();


bootStrap(app,express)


app.get('/', (req, res) => res.send('Hello World!'))
let server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))










