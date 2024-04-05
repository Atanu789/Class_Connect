import {Router} from "express"

import {verifyJWT} from "../middleware/auth.middleware.js"
import { loginUser, logoutUser, registerTeacher } from "../controllers/teacher.controllers.js"
import { sendMail } from "../controllers/mail.controller.js"

const router = Router()


router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,  logoutUser)


export default router