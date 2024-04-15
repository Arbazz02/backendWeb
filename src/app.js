import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
const limits="20kb"

const app=express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    optionsSuccessStatus:200
}))
// taking data form froms body 
app.use(express.json({limit:`${limits}`}))

// taking data form url
app.use(express.urlencoded({extended:true,limit:`${limits}`}));

// for storing file folder  in public directory(for eg, pdf aaya mere pass wos ko store karna hai, ya imges ko )
app.use(express.static('public')); //for static files like css and images

//to use a cookie form the user web
app.use(cookieParser())


export {app}