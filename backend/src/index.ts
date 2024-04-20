import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

// import mongodb connection
const { connectDB } = mongodb;


const app = express();

// const corsOptions = {
//     origin: 'https://craiveco.vercel.app',
//     credentials: true,
// };

const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://craiveco.vercel.app' , 'https://sndm.vercel.app' , 'https://sndr.vercel.app' , 'https://sndrn.vercel.app'];

const corsOptions = {
    origin: function (origin:any, callback:any) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.options('*', function (req, res, next) {
    const requestOrigin = req.headers.origin;
    if (allowedOrigins.includes(requestOrigin)) {
        res.header('Access-Control-Allow-Origin', requestOrigin || '*');
    }else {
        res.header('Access-Control-Allow-Origin', '*');
    }
    // res.header('Access-Control-Allow-Origin', 'https://craiveco.vercel.app');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.sendStatus(200);
    next();
});

const server = http.createServer(app);

// mongoose connection
connectDB();

// routes
import routes from './routes/index.routes';


app.use('/' , routes);

app.get('/test' , (req , res) => {
    res.send('Server is running');
});

server.listen( process.env.PORT || 3001 ,() => {
    console.log(`server is running on port http://localhost:${process.env.PORT || 3001}/`);
})
