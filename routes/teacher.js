import { Router } from 'express';
import TeacherController from '../controllers/Teachers/TeacherController';

const router = Router();

const { register, confirmation, login, teacherDetails} = TeacherController;
  
  // Routes
// Wallet API COLLECTION
router.post('/teacher/register', register);
router.post('/teacher/confirmation', confirmation);
router.post('/teacher/login', login);
router.get('/teacher', teacherDetails);



export default router;