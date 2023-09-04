import {
  CommentAddedEvent,
  PostAddedEvent,
} from '@big-whale-labs/obss-storage-contract/dist/typechain/contracts/Feeds'
import { parseComment } from '@/helpers/parse'
import { parsePost } from '@/helpers/parse'

export function processCommentsForNotifications(comments: CommentAddedEvent[]) {
  return comments.map(parseComment)
}

export function processPostsForNotifications(posts: PostAddedEvent[]) {
  return posts.map(parsePost)
}
