import express from 'express';
import teacherRoute from './teacher';
import applicantRoute from './applicant';

//import { smd } from '../middlewares/auth/token.access';

const router = express.Router();

router.use('/skillclique/teacher', teacherRoute, );
router.use('/skillclique/applicant', applicantRoute,);

export default router;
