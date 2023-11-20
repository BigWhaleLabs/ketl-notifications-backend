import {
  CommentAddedEvent,
  PostAddedEvent,
} from '@big-whale-labs/obss-storage-contract/dist/typechain/contracts/Feeds'
import { generateRandomName } from '@big-whale-labs/backend-utils'
import feedsData from '@/helpers/feedsData'
import structToCid from '@/helpers/structToCid'

export function parseComment(commentEvent: CommentAddedEvent) {
  const { args } = commentEvent
  const feedId = args[0].toNumber()
  const postId = args[1].toNumber()
  const commentId = args[2].toNumber()
  const comment = args[3]
  const [sender, metadata, timestamp, threadId, replyTo, numberOfComments] =
    comment
  return {
    commentId,
    feedId,
    feedName: feedsData[feedId],
    metadata: structToCid(metadata),
    numberOfComments: numberOfComments.toNumber(),
    postId,
    replyTo: replyTo.toNumber(),
    sender,
    threadId: threadId.toNumber(),
    timestamp: timestamp.toNumber(),
    username: generateRandomName(sender),
  }
}

export function parsePost(postEvent: PostAddedEvent) {
  const { args } = postEvent
  const feedId = args[0].toNumber()
  const postId = args[1].toNumber()
  const post = args[2]
  const [sender, metadata, timestamp, threadId, replyTo, numberOfComments] =
    post
  return {
    feedId,
    feedName: feedsData[feedId],
    metadata: structToCid(metadata),
    numberOfComments: numberOfComments.toNumber(),
    postId,
    replyTo: replyTo.toNumber(),
    sender,
    threadId: threadId.toNumber(),
    timestamp: timestamp.toNumber(),
    username: generateRandomName(sender),
  }
}
