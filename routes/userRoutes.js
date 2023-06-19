import { Router } from "express"
import { getAll, createUser, login, addNewTweetToUser, addRetweetToUser, addQuoteToUser, follow, unfollow, editProfile, deleteAccount } from "../controllers/users.js"
import jwt from "jsonwebtoken"
const { sign, verify } = jwt


const userRoutes = Router()

userRoutes.get("/", getAll)

userRoutes.post("/create", createUser)

userRoutes.post("/login", login)

userRoutes.patch("/post-tweet", authenticateToken, addNewTweetToUser)

userRoutes.patch("/retweet-to-user", authenticateToken, addRetweetToUser)

userRoutes.patch("/quote_to_user", authenticateToken, addQuoteToUser)

userRoutes.patch("/follow", authenticateToken, follow)

userRoutes.patch("/unfollow", authenticateToken, unfollow)

userRoutes.patch("/editProfile", authenticateToken, editProfile)

userRoutes.delete("/delete_account", authenticateToken, deleteAccount)



function authenticateToken(req, res, next) {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token === undefined || token === null) return res.status(401).json({ message: "There is no token" })

    verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Token is not valid" })

        req.user = user
        next()
    })
}

export { userRoutes }
