import {Router} from 'express'
import { addSnapshot, getAllScreenshots } from '../controllers/screenshots.js';
import path from 'path'
import fs from 'fs'

const screenshot_path = "D://Python Programming//Projects//mercor-t3-project//express-server//screenshots"

const router = Router()

router.post("/add",addSnapshot)

router.post("/all",getAllScreenshots)

router.get("/{:eid}/{:sid}",async(req,res)=>{
    const {eid,sid} = req.params
    let p = path.join(screenshot_path,eid,sid)
    if(fs.existsSync(p)){
        res.status(200).sendFile(p);
        return
    }
    res.status(404).json({status:false,message:"Screenshot does not exist"})
})

export default router