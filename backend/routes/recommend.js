const express=require('express');
const router=express.Router();
const {generateRecommendations}=require('../controllers/recommendController');


router.post('/',generateRecommendations);

module.exports=router;
