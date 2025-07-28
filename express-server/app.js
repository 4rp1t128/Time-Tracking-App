import express from 'express'
import cors from 'cors'
import {config } from 'dotenv'
import projectsRouter from './routes/projects.js'
import employeesRouter from './routes/employees.js'
import tasksRouter from './routes/tasks.js'
import timeLogsRouter from './routes/timelogs.js'
import screenshotsRouter from './routes/screenshot.js'

config()
const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())

app.use("/projects",projectsRouter);
app.use("/employees",employeesRouter);
app.use("/tasks",tasksRouter);
app.use("/timelogs",timeLogsRouter);
app.use("/screenshots",screenshotsRouter);

app.get("/",async(req,res)=>{
    res.json({message:"OK"})
})

app.listen(PORT,()=>{
    console.log(`Server Running on ${PORT}`)
})

