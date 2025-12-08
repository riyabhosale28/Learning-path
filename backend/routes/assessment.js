const express=require('express');
const router=express.Router();
const {submitAssessment}=require('../controllers/assessmentController');

router.post('/',submitAssessment);

module.exports=router;

