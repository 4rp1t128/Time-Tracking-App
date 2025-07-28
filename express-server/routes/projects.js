import {Router} from 'express'
import { addProject, allProject, removeProject } from '../controllers/projects.js';
const router = Router()

router.post("/add",addProject)
router.get("/all",allProject)
router.delete("/remove",removeProject)

export default router
