import {Router} from 'express'
import { addSnapshot, getAllScreenshots } from '../controllers/screenshots.js';
import path from 'path'
import fs from 'fs'

const router = Router()

router.post("/add",addSnapshot)

router.post("/all",getAllScreenshots)

router.get("/:eid/:sid",async(req,res)=>{
    const {eid,sid} = req.params
    let p = path.join(process.cwd(),"screenshots",eid,sid)
    if(fs.existsSync(p)){
        res.status(200).sendFile(p);
        return
    }
    res.setHeader("Access-Control-Allow-Origin","*")
    res.status(404).json({status:false,message:"Screenshot does not exist"})
})

export default router