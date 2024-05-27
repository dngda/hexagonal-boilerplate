import bodyparser from 'body-parser';
import express, { Express, Request, Response } from "express"
import cors from 'cors';
import fileUpload from 'express-fileupload';
import dotenv from "dotenv"
import cookieParser from 'cookie-parser';
import { loggingMiddleware } from './src/util/logger/logging';
import { initMysql } from './src/util/mysql/mysql';
import { initMongo } from './src/util/mongodb/mongodb';
import { config } from './config/config';
import { initRabbitMQ } from './src/util/rabbitmq/rabbitmq';
import { initFirebase } from './src/util/firebase/firebase';
import { NotificationRestController } from './src/adapter/in/rest/notification/controller/controller';
import { TokenizationRestController } from './src/adapter/in/rest/tokenization/controller/controller';

const app: Express = express()
const port = config.app.appPort
const apiVersion = config.app.apiVersion
const appName = config.app.appName

dotenv.config()
app.use(bodyparser.json())
app.use(cors())
app.use(fileUpload())
app.use(cookieParser())

app.use(loggingMiddleware)

// Init configuration
initMongo()
initRabbitMQ()
initFirebase()

const notificationRestController = new NotificationRestController(app)
notificationRestController.init()

const tokenizationRestController =  new TokenizationRestController(app)
tokenizationRestController.init()

app.get('/', (_: Request, res: Response) => {
    res.send(`
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
        <pre>
            
███╗   ██╗ ██████╗ ████████╗██╗███████╗██╗ ██████╗ █████╗ ████████╗██╗ ██████╗ ███╗   ██╗     █████╗ ██████╗ ██╗
████╗  ██║██╔═══██╗╚══██╔══╝██║██╔════╝██║██╔════╝██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║    ██╔══██╗██╔══██╗██║
██╔██╗ ██║██║   ██║   ██║   ██║█████╗  ██║██║     ███████║   ██║   ██║██║   ██║██╔██╗ ██║    ███████║██████╔╝██║
██║╚██╗██║██║   ██║   ██║   ██║██╔══╝  ██║██║     ██╔══██║   ██║   ██║██║   ██║██║╚██╗██║    ██╔══██║██╔═══╝ ██║
██║ ╚████║╚██████╔╝   ██║   ██║██║     ██║╚██████╗██║  ██║   ██║   ██║╚██████╔╝██║ ╚████║    ██║  ██║██║     ██║
╚═╝  ╚═══╝ ╚═════╝    ╚═╝   ╚═╝╚═╝     ╚═╝ ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝    ╚═╝  ╚═╝╚═╝     ╚═╝
                                                                                                                
                                                    
        </pre>
    </div>
    `)
})

app.listen(port, () => {
    console.log(`${appName} is listening on port ${port}`)
})
