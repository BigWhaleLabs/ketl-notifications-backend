import { Post, defaultPostProjection } from '@/models/Post'
import { getModelForClass, prop } from '@typegoose/typegoose'

export class Comment extends Post {
  @prop({ required: true })
  public commentId!: number
  @prop({ required: true })
  public replyTo!: number
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
  return CommentModel.aggregate([
    {
      $match: {
        blockNumber: { $gt: fromBlock, $lte: toBlock },
        isDev,
      },
    },
    {
      $lookup: {
        as: 'replyToComment',
        foreignField: 'commentId',
        from: 'comments',
        localField: 'replyTo',
      },
    },
    {
      $unwind: {
        path: '$replyToComment',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        replyToComment: {
          $cond: {
            else: null,
            if: {
              $and: [
                { $eq: ['$replyToComment.commentId', '$replyTo'] },
                { $eq: ['$replyToComment.isDev', isDev] },
              ],
            },
            then: {
              commentId: '$replyToComment.commentId',
              metadata: '$replyToComment.metadata',
              sender: '$replyToComment.sender',
              timestamp: '$replyToComment.timestamp',
              username: '$replyToComment.username',
            },
          },
        },
      },
    },
    {
      $project: {
        ...defaultPostProjection,
        replyToComment: 1,
      },
    },
  ])
}
