import { Post } from '@/models/Post'
import { getModelForClass, prop } from '@typegoose/typegoose'

export class Comment extends Post {
  @prop({ required: true })
  public commentId!: number
  @prop({ required: true })
  public replyTo!: number
}

export const CommentModel = getModelForClass(Comment)
