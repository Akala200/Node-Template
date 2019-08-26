import { Router } from 'express';
import ApplicantController from '../controllers/Applicant/ApplicantController';

const router = Router();

const { register, confirmation, login, applicantDetails} = ApplicantController;
  
  // Routes
// Wallet API COLLECTION
router.post('/admin/register', register);
router.post('/admin/confirmation', confirmation);
router.post('/admin/login', login);
router.get('/admin', applicantDetails);



export default router;