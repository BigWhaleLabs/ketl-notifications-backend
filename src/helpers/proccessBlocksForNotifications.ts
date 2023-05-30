import { BigNumber } from 'ethers'
import {
  CommentAddedEvent,
  PostAddedEvent,
} from '@big-whale-labs/obss-storage-contract/dist/typechain/contracts/Feeds'
import CID from '@/models/CID'
import generateRandomName from '@/helpers/generateRandomName'
import parsePostLogData from '@/helpers/parsePostLogData'
import structToCid from '@/helpers/structToCid'

export function proccessCommentsForNotifications(
  comments: CommentAddedEvent[]
) {
  return comments.map(({ args }) => {
    const feedId = args[0].toNumber()
    const postId = args[1].toNumber()
    const commentId = args[2].toNumber()
    const comment = args[3]
    const [sender, metadata, timestamp, threadId, replyTo, numberOfComments] =
      comment
    return {
      commentId,
      feedId,
      metadata: structToCid(metadata),
      numberOfComments: numberOfComments.toNumber(),
      postId,
      replyTo: replyTo.toNumber(),
      sender,
      threadId: threadId.toNumber(),
      timestamp: timestamp.toNumber(),
      username: generateRandomName(sender),
    }
  })
}

export function proccessPostsForNotifications(posts: PostAddedEvent[]) {
  return posts.map(({ args }) => {
    const feedId = args[0].toNumber()
    const postId = args[1].toNumber()
    const post = args[2]
    const [sender, metadata, timestamp, threadId, replyTo, numberOfComments] =
      post
    console.log('sender', sender)
    return {
      feedId,
      metadata: structToCid(metadata),
      numberOfComments: numberOfComments.toNumber(),
      postId,
      replyTo: replyTo.toNumber(),
      sender,
      threadId: threadId.toNumber(),
      timestamp: timestamp.toNumber(),
      username: generateRandomName(sender),
    }
  })
}
