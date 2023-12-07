import { ModelOptions, getModelForClass, prop } from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { generateRandomName } from '@big-whale-labs/backend-utils'

@ModelOptions({
  schemaOptions: { id: false, timestamps: true, virtuals: true },
})
export class Post extends TimeStamps {
  @prop({ required: true })
  transactionHash!: string
  @prop({ required: true })
  public blockNumber!: number
  @prop({ required: true })
  public feedId!: number
  @prop({ required: true })
  public threadId!: number
  @prop({ required: true })
  public timestamp!: number
  @prop({ required: true })
  public postId!: number
  @prop({ default: false })
  public isDev!: boolean
  @prop({ required: true })
  public metadata!: string
  @prop({ required: true })
  public sender!: string
  @prop({ required: true })
  public numberOfComments!: number

  public get username() {
    return generateRandomName(this.sender)
  }
}

export const PostModel = getModelForClass(Post)

export const defaultPostProjection = {
  _id: 0,
  commentId: 1,
  feedId: 1,
  metadata: 1,
  numberOfComments: 1,
  postId: 1,
  replyTo: 1,
  sender: 1,
  threadId: 1,
  timestamp: 1,
  username: 1,
}
