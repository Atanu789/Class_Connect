import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN, 
    credentials:true
}))
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import  studentRouter from "./routes/student.routes.js"
import notesRouter from "./routes/notes.routes.js"
app.use("/api/v1/students",studentRouter)
app.use("/api/v1/students",notesRouter)
app.use("/api/v1/students",assignmentRouter)
app.use("/api/v1/students",quizzRouter)
app.use("/api/v1/students",studentRouter)
//assignment
import assignmentRouter from "./routes/assignment.routes.js"
import  teacherRouter from "./routes/teacher.routes.js"
import quizzRouter from "./routes/quizz.routes.js"
import { sendMail } from "./controllers/mail.controller.js"
app.use("/api/v1/teachers",teacherRouter)
app.use("/api/v1/teachers",assignmentRouter)
app.use("/api/v1/teachers",quizzRouter)
// Route for sending mail
app.get("/api/v1/teachers/sendMail", async (req, res) => {
    sendMail((error, message) => {
        if (error) {
            console.error("Error sending email:", error);
            return res.status(500).send("Error sending email");
        }

        console.log(message);
        res.send(message);
    });
});


export default app;