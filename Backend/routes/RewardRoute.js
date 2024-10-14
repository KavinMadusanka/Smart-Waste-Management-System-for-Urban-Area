import express from 'express';
import { createReward, 
    getAllReward, 
    getSingleRewaard, 
    RewardPhotoController, 
    deleteReward, 
    updateReward } from "../controllers/RewardController.js";
import formidable from 'express-formidable';

const router = express.Router();

//routes 
// create waste category
router.post('/create-reward',formidable(),createReward);
// get all waste categories
router.get('/get-rewards',getAllReward);
// get single waste category
router.get('/get-single-reward/:slug', getSingleRewaard);
// get photo
router.get('/reward-photo/:cid',RewardPhotoController);
// delete waste category
router.delete('/delete-reward/:cid',deleteReward);
// update waste category
router.put('/update-reward/:cid',formidable(),updateReward);

export default router;