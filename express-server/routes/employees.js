import { Router } from 'express'
import { activateEmployee, addEmployee, addEmployeeToProject, allEmployee, authenticateEmployee, removeEmployee } from '../controllers/employees.js';

const router = Router()

router.post("/add",addEmployee)

router.get("/all",allEmployee)

router.post("/auth",authenticateEmployee)

router.post("/activate",activateEmployee)

router.post("/addToProject",addEmployeeToProject)

router.delete("/remove",removeEmployee)

export default router
