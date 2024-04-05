import { Router } from "express";
import { getAssignments, giveAssignment, solutionAssignment} from "../controllers/assignment.controller.js";
import { upload } from "../middleware/multer.middleware.js";
 const router = Router();
 router.route("/assignments").post(giveAssignment)
 router.route("/getAssignments").get(getAssignments)
router.route("/solAssignment/:assignmentId/:studentId").post(
    upload.fields([
        {
            name: "pptUrl",
            maxCount: 1
        },
        {
            name: "videoUrl",
            maxCount: 1
        }
    ]),
    solutionAssignment
);

 export default router;