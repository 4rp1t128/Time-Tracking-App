import {Router} from 'express'
import { addTask, allTask, filterTasks, removeTask, updateTask } from '../controllers/tasks.js';

const router = Router()

router.post("/filter",filterTasks)

router.get("/all",allTask)

router.post("/add",addTask)

router.delete("/remove",removeTask)

router.post("/update",updateTask)

export default router
