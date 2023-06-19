import mongoose from "mongoose";
import moment from "moment"


const tweetSchema = mongoose.Schema({
    type: String,
    content: String,
    image: String,
    createdAt: {
        type: Date,
        default: moment(),
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    retweetedBy: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    likedBy: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    quotedBy: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    replies: [{
        type: Object,
        replyedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        reply: String,
        createdAt: {
            type: Date,
            default: new Date()
        }
    }],
    thisRetweet: {
        originalTweet: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    thisQuote: {
        originalTweet: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' },
    },
    quotesOfThisTweet: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }]
});

const Tweet = mongoose.model("Tweet", tweetSchema);

export default Tweet;