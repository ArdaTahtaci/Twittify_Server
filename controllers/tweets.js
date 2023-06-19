import Tweet from "../models/tweets.js"
import User from "../models/users.js"


export const getAll = async (req, res) => {

    try {
        let tweets = await Tweet.find()
        tweets = tweets.reverse()
        res.status(200).json(tweets)

    } catch (error) {
        res.json({
            message: error.message
        })
    }
}

export const createOriginal = async (req, res) => {

    const { tweet } = req.body

    try {
        const newTweet = new Tweet(tweet)
        await newTweet.save()
        let all = await Tweet.find()
        all = all.reverse()

        res.status(200).json({ newTweet: newTweet, tweets: all })
    } catch (error) {
        res.json({
            message: error.message
        })
    }


}

export const like = async (req, res) => {

    const { tweet } = req.body

    const userId = req.user.userId
    try {
        const currentTweet = await Tweet.find({ _id: tweet._id })


        const likes = currentTweet[0].likedBy

        if (!likes.includes(userId)) {
            likes.push(userId)
            await Tweet.findOneAndUpdate({ _id: tweet._id }, { likedBy: likes })

            let updatedTweets = await Tweet.find()
            updatedTweets.reverse()

            res.status(201).json({
                liked: true,
                tweets: updatedTweets
            })
        }
        else {
            res.json({
                message: "already liked"
            })
        }

    } catch (error) {
        res.json({
            message: error.message
        })
    }
}

export const addRetweetToTweet = async (req, res) => {
    const { tweet } = req.body

    const userId = req.user.userId
    try {
        const currentTweet = await Tweet.find({ _id: tweet._id })


        const retweets = currentTweet[0].retweetedBy

        if (!retweets.includes(userId)) {
            retweets.push(userId)
            await Tweet.findOneAndUpdate({ _id: tweet._id }, { retweetedBy: retweets })

            const updatedTweet = await Tweet.find({ _id: tweet._id })

            let updatedTweets = await Tweet.find()
            updatedTweets.reverse()

            res.status(201).json({
                updatedTweet: updatedTweet,
                retweeted: true,
                tweets: updatedTweets
            })
        }
        else {
            res.json({
                message: "already retweeted"
            })
        }
    } catch (error) {
        res.json({
            message: error.message
        })
    }

}

export const createRetweet = async (req, res) => {

    let { tweet } = req.body

    const userId = req.user.userId

    try {

        const updatedTweet = {


            type: "retweet",
            content: tweet.content,
            image: tweet.image,
            createdAt: tweet.createdAt,
            postedBy: tweet.postedBy,
            retweetedBy: tweet.retweetedBy,
            likedBy: tweet.likedBy,
            quotedBy: tweet.quotedBy,
            quotesOfThisTweet: tweet.quotesOfThisTweet,
            replies: tweet.replies,
            thisRetweet: {
                originalTweet: tweet._id,
                createdBy: userId
            }
        }



        const newTweet = new Tweet(updatedTweet)

        await newTweet.save()

        let all = await Tweet.find()
        all = all.reverse()

        res.status(200).json({ retweetCreated: true, newTweet: newTweet, tweets: all })
    } catch (error) {
        res.json({
            retweetCreated: false,
            message: error.message
        })
    }
}


export const createQuote = async (req, res) => {

    let { tweet, quoteContent } = req.body
    const userId = req.user.userId

    const quote = {
        type: "quote",
        content: quoteContent,
        image: null,
        postedBy: userId,
        retweetedBy: [],
        likedBy: [],
        quotedBy: [],
        replies: [],
        thisTweet: null,
        thisQuote: {
            originalTweet: tweet._id
        }
    }

    const newQuote = new Tweet(quote)
    await newQuote.save()
    res.status(201).json({ newQuote: newQuote })

    try {

    } catch (error) {

    }

}

export const addQuoteToTweet = async (req, res) => {

    const { tweet, newQuote } = req.body
    const userId = req.user.userId

    try {
        const thisTweet = await Tweet.find({ _id: tweet._id })

        let updatedQuotedBy = thisTweet.quotedBy
        if (updatedQuotedBy) updatedQuotedBy.push(userId)
        else updatedQuotedBy = [userId]

        await Tweet.findOneAndUpdate({ _id: tweet._id }, { quotedBy: updatedQuotedBy })

        let updatedQuotes = thisTweet.quotesOfThisTweet
        if (updatedQuotes) updatedQuotes.push(newQuote._id)
        else updatedQuotes = [newQuote._id]

        await Tweet.findOneAndUpdate({ _id: tweet._id }, { quotesOfThisTweet: updatedQuotes })


        let updatedAllTweets = await Tweet.find()
        updatedAllTweets = updatedAllTweets.reverse()

        res.status(201).json({ allTweets: updatedAllTweets })

    } catch (error) {
        res.json({ message: error.message })
    }

}

export const reply = async (req, res) => {
    const { tweet, text } = req.body

    try {
        const replies = await Tweet.findById(tweet._id).populate('replies')

        const newReply = new Object({
            replyedBy: req.user.userId,
            relpy: text,
            createdAt: {
                type: Date,
                default: new Date()
            }
        })

        let updatedReplies = replies.replies

        if (updatedReplies) updatedReplies.push(newReply)
        else updatedReplies = [newReply]

        await Tweet.findOneAndUpdate({ _id: tweet._id }, { replies: updatedReplies })

        let updatedAllTweets = await Tweet.find()
        updatedAllTweets = updatedAllTweets.reverse()

        res.status(201).json({ allTweets: updatedAllTweets })
    } catch (error) {
        res.json({
            message: error
        })
    }

}


export const getProfileTweets = async (req, res) => {
    const userId = req.user.userId

    try {
        const allTweets = await Tweet.find()
        const thisUser = await User.findById(userId)

        const ownTweets = allTweets.filter((tweet) => {
            return tweet.postedBy === userId
        })

        let followingTweets = []
        if (thisUser.followings != [] && thisUser.followings != undefined) {
            thisUser.followings.map((user) => {
                const tweets = allTweets.filter((tweet) => {
                    return tweet.postedBy === user._id
                })
                followingTweets.push(tweets)
            })
        }

        res.status(201).json({
            ownTweets: ownTweets,
            followingTweets: followingTweets
        })


    } catch (error) {
        res.json({
            message: error.message
        })
    }
}


export const deleteTweet = async (req, res) => {

    const { tweet } = req.body
    console.log(JSON.stringify(tweet))

    try {
        await Tweet.findOneAndDelete({ _id: tweet._id })
        const allTweets = await Tweet.find()

        res.status(201).json({
            allTweets: allTweets
        })


    } catch (error) {
        res.json({
            message: error.message
        })
    }
}
