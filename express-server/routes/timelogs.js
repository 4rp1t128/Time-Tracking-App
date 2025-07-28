import {Router} from 'express'
import { addTimeLog, getAllTimeLogs, getTotalTimeWithPay } from '../controllers/timelogs.js';

const router = Router()


router.post("/all",getAllTimeLogs)

router.post("/add",addTimeLog)

router.post("/totalTime",getTotalTimeWithPay)

export default router