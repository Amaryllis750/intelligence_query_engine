import { Router } from "express";
import { createProfile, getProfile, deleteProfile, getAllProfiles } from "../controllers/profileController.js";

const router = Router();

router.post('/', createProfile);
router.get('/:id', getProfile);
router.get('/', getAllProfiles);
router.delete('/:id', deleteProfile);

export default router;  