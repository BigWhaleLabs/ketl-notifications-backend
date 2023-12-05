import {
  CommentAddedEvent,
  PostAddedEvent,
} from '@big-whale-labs/obss-storage-contract/dist/typechain/contracts/Feeds'
import { CommentModel } from '@/models/Comment'
import { PostModel } from '@/models/Post'
import { parseComment, parsePost } from '@/helpers/parse'
import getEvents from '@/helpers/getEventst'
import getFeedsContract from '@/helpers/getFeedsContract'

export async function savePostEvent(event: PostAddedEvent) {
  try {
    const post = parsePost(event)
    await PostModel.findOneAndUpdate(
      { transactionHash: post.transactionHash },
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

export async function saveCommentEvent(event: CommentAddedEvent) {
  try {
    const comment = parseComment(event)
    await CommentModel.findOneAndUpdate(
      { transactionHash: comment.transactionHash },
      comment,
      { new: true, upsert: true }
    )
  } catch (e) {
    console.error(e)
  }
}

export default async function saveBlockchainEvents() {
  const posts = await getEvents(getFeedsContract.filters.PostAdded())

  for (const post of posts) {
    await savePostEvent(post)
  }

  const comments = await getEvents(getFeedsContract.filters.CommentAdded())
  for (const comment of comments) {
    await saveCommentEvent(comment)
  }
}
