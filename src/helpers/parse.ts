import {
  CommentAddedEvent,
  PostAddedEvent,
  PostStructOutput,
} from '@big-whale-labs/obss-storage-contract/dist/typechain/contracts/Feeds'
import { generateRandomName } from '@big-whale-labs/backend-utils'
import structToCid from '@/helpers/structToCid'

function transform(post: PostStructOutput) {
  const [sender, metadata] = post
  const [, , timestamp, threadId, replyTo, numberOfComments] = post.map(Number)

  return {
    metadata: structToCid(metadata),
    numberOfComments,
    replyTo,
    sender,
    threadId,
    timestamp,
    username: generateRandomName(sender),
  }
}

function eventProperties(event: PostAddedEvent | CommentAddedEvent) {
  const { blockNumber, transactionHash } = event

  return {
    blockNumber,
    transactionHash,
  }
}

export function parsePost(postEvent: PostAddedEvent) {
  const { args } = postEvent
  const [feedId, postId] = args.slice(0, 2).map(Number)
  const post = args[2]

  return {
    ...transform(post),
    ...eventProperties(postEvent),
    feedId,
    postId,
  }
}

export function parseComment(commentEvent: CommentAddedEvent) {
  const { args } = commentEvent
  const [feedId, postId, commentId] = args.slice(0, 3).map(Number)
  const comment = args[3]

  return {
    ...transform(comment),
    ...eventProperties(commentEvent),
    commentId,
    feedId,
    postId,
  }
}
