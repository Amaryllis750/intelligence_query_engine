import { Router } from "express";
import { createProfile, getProfile, getProfiles, deleteProfile } from "../controllers/profileController.js";

const router = Router();

router.post('/', createProfile);
router.get('/:id', getProfile);
router.get('/', getProfiles);
router.delete('/:id', deleteProfile);

export default router;  