import User from "../models/users.js"
import bcrypt from "bcrypt"
import { uuid } from "uuidv4"
import jwt from "jsonwebtoken"
const saltRound = 10

const { sign, verify } = jwt


export const getAll = async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json(users)

    } catch (error) {
        res.status(404).json({
            message: error.message,
        })
    }
}

export const createUser = (req, res) => {

    let data = req.body
    data = {
        ...data,
        profilePhoto: data.name.substr(0, 0).toUpperCase()
    }

    bcrypt.hash(data.password, saltRound, (err, hash) => {
        const newUser = new User({
            ...data,
            password: hash,
            userId: uuid()
        })

        newUser.save().then(() => {
            res.status(201).json(newUser)
        }).catch((err) => {
            res.status(409).json({
                message: err.message
            })
        })

    })
}

export const login = (req, res) => {
    const { eMail, password } = req.body

    User.findOne({ eMail: eMail }).then((user) => { //authentication

        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {   //creating token

                const accessToken = sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET)
                res.status(200).json({ accessToken: accessToken, user: user })

            } else {
                res.status(401).json({ message: "Password did not match" })
            }
        })

    }).catch((err) => {
        res.status(404).json({ message: "No such user" })

    })


}

export const addNewTweetToUser = async (req, res) => {

    const { tweet } = req.body
    const userId = req.user.userId

    try {
        const user = await User.findById({ _id: userId })

        const updatedTweets = user.tweets
        if (updatedTweets) updatedTweets.push(tweet._id)
        else updatedTweets = [tweet._id]

        await User.findOneAndUpdate({ _id: userId }, { tweets: updatedTweets })

        const allUsers = await User.find()
        const thisUser = await User.find({ _id: userId })
        res.status(201).json({ updated: true, allUsers: allUsers, thisUser: thisUser[0] })

    } catch (error) {
        res.json({
            message: error.message
        })
    }


}

export const addRetweetToUser = async (req, res) => {

    const newRetweet = req.body.newRetweet

    try {
        const user = await User.findById(req.user.userId)

        const updatedTweets = user.tweets
        updatedTweets.push(newRetweet)

        await User.findOneAndUpdate({ _id: req.user.userId }, { tweets: updatedTweets })

        const all = await User.find()
        res.status(201).json({ updated: true, allUsers: all })
    } catch (error) {
        res.json({
            message: error.message
        })
    }

}

export const addQuoteToUser = async (req, res) => {
    const { newQuote } = req.body
    const userId = req.user.userId

    try {
        const thisUser = await User.find({ _id: userId })

        let updatedTweets = thisUser.tweets
        if (updatedTweets) updatedTweets.push(newQuote._id)
        else updatedTweets = [newQuote._id]

        await User.findOneAndUpdate({ _id: userId }, { tweets: updatedTweets })

        const allUsers = await User.find()

        res.status(201).json({ allUsers: allUsers })
    } catch (error) {
        res.json({ message: error.message })
    }

}

export const follow = async (req, res) => {
    const { profileOwner } = req.body

    const userId = req.user.userId
    const profileOwnerId = profileOwner._id

    try {

        const user = await User.findById({ _id: userId })

        const updatedFollowings = user.followings
        if (updatedFollowings) updatedFollowings.push(profileOwnerId)
        else updatedFollowings = [profileOwnerId]


        const profileOwnerUser = await User.findById({ _id: profileOwnerId })

        const updatedFollowers = profileOwnerUser.followers
        if (updatedFollowers) updatedFollowers.push(user._id)
        else updatedFollowers = [user._id]

        await User.findOneAndUpdate({ _id: userId }, { followings: updatedFollowings })
        await User.findOneAndUpdate({ _id: profileOwnerId }, { followers: updatedFollowers })

        const allUsers = await User.find()
        const thisUser = await User.find({ _id: userId })

        res.status(201).json({
            allUsers: allUsers,
            currentUser: thisUser[0]
        })

    } catch (error) {
        res.json({ message: error.message })
    }
}

export const unfollow = async (req, res) => {
    const { profileOwner } = req.body

    const userId = req.user.userId
    const profileOwnerId = profileOwner._id

    try {

        const user = await User.findById({ _id: userId })

        const updatedFollowings = user.followings
        updatedFollowings.pop(profileOwnerId)



        const profileOwnerUser = await User.findById({ _id: profileOwnerId })

        const updatedFollowers = profileOwnerUser.followers
        updatedFollowers.pop(user._id)


        await User.findOneAndUpdate({ _id: userId }, { followings: updatedFollowings })
        await User.findOneAndUpdate({ _id: profileOwnerId }, { followers: updatedFollowers })

        const allUsers = await User.find()
        const thisUser = await User.find({ _id: userId })

        res.status(201).json({
            allUsers: allUsers,
            currentUser: thisUser[0]
        })

    } catch (error) {
        res.json({ message: error.message })
    }
}


export const editProfile = async (req, res) => {

    const { data } = req.body
    const userId = req.user.userId

    try {

        if (data[0]) await User.findOneAndUpdate({ _id: userId }, { profileBackgroundPhoto: data[0] })
        if (data[1]) await User.findOneAndUpdate({ _id: userId }, { profilePhoto: data[1] })
        if (data[2]) await User.findOneAndUpdate({ _id: userId }, { name: data[2] })
        if (data[3]) await User.findOneAndUpdate({ _id: userId }, { bio: data[3] })

        const allUsers = await User.find()
        const thisUser = await User.find({ _id: userId })

        res.status(201).json({
            allUsers: allUsers,
            currentUser: thisUser[0]
        })

    } catch (error) {
        res.json({ message: error.message })
    }

}

export const deleteAccount = async (req, res) => {
    const userId = req.user.userId

    try {

        await User.findOneAndUpdate({ _id: userId }, { profileBackgroundPhoto: null })
        await User.findOneAndUpdate({ _id: userId }, { profilePhoto: null })
        await User.findOneAndUpdate({ _id: userId }, { name: "" })
        await User.findOneAndUpdate({ _id: userId }, { bio: "" })
        await User.findOneAndUpdate({ _id: userId }, { userName: "User_Not_Found" })
        await User.findOneAndUpdate({ _id: userId }, { deleted: true })
        await User.findOneAndUpdate({ _id: userId }, { eMail: null })

        res.status(201)


    } catch (error) {
        res.json({
            error: error.message
        })
    }
}




