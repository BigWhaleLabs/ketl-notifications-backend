import {
  CommentAddedEvent,
  PostAddedEvent,
} from '@big-whale-labs/obss-storage-contract/dist/typechain/contracts/Feeds'
import { parseComemnt } from '@/helpers/parse'
import { parsePost } from '@/helpers/parse'

export function proccessCommentsForNotifications(
  comments: CommentAddedEvent[]
) {
  return comments.map(parseComemnt)
}

export function proccessPostsForNotifications(posts: PostAddedEvent[]) {
  return posts.map(parsePost)
}
