import { Router } from 'express'
import { sign } from 'jsonwebtoken'

const AuthController = Router()

interface AuthInterface {
    email: string,
    accessToken: string
}

const auths: AuthInterface[] = [];

AuthController.get("/", (req, res) => {
    res.send("Welcome to auth")
});

AuthController.post("/signup", (req, res) => {
    if (typeof (req.body) === "object") {
        const { email, password, confirmPassword } = req.body;
        console.log(email)
        if ( email !== undefined && password !== undefined && confirmPassword !== undefined ) {
            const doesExist = auths.find((auth) => auth.email === email)
            if (doesExist === undefined) {
                const jwt = sign({
                    email
                }, "secret")
                auths.push({
                    email,
                    accessToken: jwt
                })
                res.status(200).json({ msgId: "signup-successfull" })
            } else {
                res.status(400).json({ msgId: "already-signed-up" })
            }
        } else {
            res.status(400).json({ msgId: "req-body-incorrect" })
        }
    } else {
        res.status(404).json({ msgId: "req-body-undefined" })
    }
});

AuthController.post("/signin", (req, res) => {
    res.send("dzadzas")
});

export default AuthController