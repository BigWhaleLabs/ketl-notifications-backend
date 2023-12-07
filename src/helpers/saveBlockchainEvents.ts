import {
  CommentAddedEvent,
  PostAddedEvent,
} from '@big-whale-labs/obss-storage-contract/dist/typechain/contracts/Feeds'
import { CommentModel } from '@/models/Comment'
import { PostModel } from '@/models/Post'
import { parseComment, parsePost } from '@/helpers/parse'
import getEvents from '@/helpers/getEventst'
import getFeedsContract from '@/helpers/getFeedsContract'

export async function savePostEvent(event: PostAddedEvent, isDev = false) {
  try {
    const post = parsePost(event)
    await PostModel.findOneAndUpdate(
      {
        feedId: post.feedId,
        isDev,
        postId: post.postId,
        transactionHash: post.transactionHash,
      },
      post,
      {
        new: true,
        upsert: true,
      }
    )
  } catch (e) {
    console.error(e)
  }
}

export async function saveCommentEvent(
  event: CommentAddedEvent,
  isDev = false
) {
  try {
    const comment = parseComment(event)
    let replyToPost, replyToComment
    if (comment.replyTo === 0) {
      replyToPost = await PostModel.findOne({
        feedId: comment.feedId,
        isDev,
        postId: comment.postId,
      })
    } else {
      replyToComment = await CommentModel.findOne({
        commentId: comment.replyTo,
        feedId: comment.feedId,
        isDev,
        postId: comment.postId,
      })
    }
    await CommentModel.findOneAndUpdate(
      {
        commentId: comment.commentId,
        feedId: comment.feedId,
        isDev,
        postId: comment.postId,
        transactionHash: comment.transactionHash,
      },
      {
        ...comment,
        replyToComment,
        replyToPost,
      },
      { new: true, upsert: true }
    )
  } catch (e) {
    console.error(e)
  }
}

export default async function saveBlockchainEvents() {
  const findLatest = await CommentModel.findOne({}).sort({ blockNumber: -1 })

  const posts = await getEvents(
    getFeedsContract.filters.PostAdded(),
    findLatest?.blockNumber ? findLatest.blockNumber - 1 : undefined
  )

  for (const post of posts) {
    await savePostEvent(post)
  }

  const comments = await getEvents(getFeedsContract.filters.CommentAdded())
  for (const comment of comments) {
    await saveCommentEvent(comment)
  }
}
