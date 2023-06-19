import { Router } from "express"
import { createOriginal, createRetweet, getAll, like, addRetweetToTweet, createQuote, reply, getProfileTweets, deleteTweet } from "../controllers/tweets.js"
import jwt from "jsonwebtoken"
import { addQuoteToTweet } from "../controllers/tweets.js"
const { sign, verify } = jwt

const tweetRoutes = Router()

tweetRoutes.get("/", getAll)

tweetRoutes.post("/create-original", authenticateToken, createOriginal)

tweetRoutes.patch("/like", authenticateToken, like)

tweetRoutes.patch("/retweet-to-tweet", authenticateToken, addRetweetToTweet)

tweetRoutes.post("/create-retweet", authenticateToken, createRetweet)

tweetRoutes.post("/create-quote", authenticateToken, createQuote)

tweetRoutes.patch("/quote-to-tweet", authenticateToken, addQuoteToTweet)

tweetRoutes.patch("/reply", authenticateToken, reply)

tweetRoutes.get("/get-profile-tweets", authenticateToken, getProfileTweets)

tweetRoutes.delete("/delete-tweet", authenticateToken, deleteTweet)




function authenticateToken(req, res, next) {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    // console.log(JSON.stringify(token))
    if (token === undefined || token === null) return res.status(401).json({ message: "There is no token" })
    verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Token is not valid" })
        req.user = user
        next()
    })
}

export { tweetRoutes }

