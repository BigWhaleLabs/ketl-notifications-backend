// TokenModel.js
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: { timestamps: true },
})
export class Token {
  @prop({ index: true })
  token!: string

  @prop()
  lastSentTime?: Date
}

export const TokenModel = getModelForClass(Token)
