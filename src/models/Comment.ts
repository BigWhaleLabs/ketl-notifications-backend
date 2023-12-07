import { Post, defaultPostProjection } from '@/models/Post'
import { Ref, getModelForClass, prop } from '@typegoose/typegoose'

export class Comment extends Post {
  @prop({ required: true })
  public commentId!: number
  @prop({ required: true })
  public replyTo!: number
  @prop({ ref: () => Comment })
  replyToComment?: Ref<Comment>
  @prop({ ref: () => Post })
  replyToPost?: Ref<Post>
}

export const CommentModel = getModelForClass(Comment)

export function getComments({
  fromBlock,
  isDev = false,
  toBlock,
}: {
  fromBlock?: number
  toBlock: number
  isDev?: boolean
}) {
  return CommentModel.find(
    {
      blockNumber: { $gt: fromBlock, $lte: toBlock },
      isDev,
    },
    {
      ...defaultPostProjection,
      replyToComment: 1,
      replyToPost: 1,
    }
  ).populate([
    {
      path: 'replyToComment',
      select: defaultPostProjection,
    },
    {
      path: 'replyToPost',
      select: defaultPostProjection,
    },
  ])
}
