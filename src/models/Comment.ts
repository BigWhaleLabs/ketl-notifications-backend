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
      $lookup: {
        as: 'replyToPost',
        foreignField: 'postId',
        from: 'posts',
        localField: 'postId',
      },
    },
    {
      $unwind: {
        path: '$replyToComment',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: '$replyToPost',
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
                { $eq: ['$replyToComment.postId', '$postId'] },
                { $eq: ['$replyToComment.feedId', '$feedId'] },
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
        replyToPost: {
          $cond: {
            else: null,
            if: {
              $and: [
                { $eq: ['$replyToPost.postId', '$postId'] },
                { $eq: ['$replyToPost.feedId', '$feedId'] },
                { $eq: ['$replyToPost.isDev', isDev] },
                { $eq: ['$replyTo', 0] },
              ],
            },
            then: {
              metadata: '$replyToPost.metadata',
              postId: '$replyToPost.postId',
              sender: '$replyToPost.sender',
              timestamp: '$replyToPost.timestamp',
              username: '$replyToPost.username',
            },
          },
        },
      },
    },
    {
      $project: {
        ...defaultPostProjection,
        replyToComment: 1,
        replyToPost: 1,
      },
    },
  ])
}
