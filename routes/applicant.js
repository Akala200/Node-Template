import { Router } from 'express';
import ApplicantController from '../controllers/Applicant/ApplicantController';

const router = Router();

const { register, confirmation, login, applicantDetails} = ApplicantController;
  
  // Routes
// Wallet API COLLECTION
router.post('/applicant/register', register);
router.post('/applicant/confirmation', confirmation);
router.post('/applicant/login', login);
router.get('/applicant', applicantDetails);



export default router;