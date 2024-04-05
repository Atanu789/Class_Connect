import { Router } from "express";
import { registerStudent, loginUser, logoutUser, findUser, getAllStudents, findStudentByUsername } from "../controllers/student.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "studentAvatar",
            maxCount: 1
        }
    ]),
    async (req, res, next) => {
        try {
            await registerStudent(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);


router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/find/:userId").get(findUser);
router.route("/getStudents").get(getAllStudents);
router.route("/findStudent/:userName").get(findStudentByUsername)
export default router;
