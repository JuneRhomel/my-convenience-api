import { Router } from "express";
import login from "../controllers/auth/login.controllers";
import loginWithGoogle from "../controllers/auth/login_with_google.controllers";
import signUp from "../controllers/auth/sign_up.controllers";


const router = Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/google", loginWithGoogle);

export default router;
