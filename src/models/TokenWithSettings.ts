import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import NotificationSettings from '@/models/NotificationSettings'
import notificationTokenRegex from '@/helpers/regexes'

@modelOptions({ schemaOptions: { timestamps: true } })
export class TokenWithSettings {
  @prop({ index: true, unique: true })
  token!: string
  @prop({ default: true })
  allPostsEnabled!: boolean
  @prop({ default: true })
  hotPostsEnabled!: boolean
  @prop({ default: true })
  repliesEnabled!: boolean
  @prop({ default: false })
  expired!: boolean
}

export function findSettingsByToken(token: string) {
  return TokenModel.findOne({ token }).select([
    '-_id',
    'repliesEnabled',
    'hotPostsEnabled',
    'allPostsEnabled',
    'token',
  ])
}

export async function updateTokenWithSettings(
  token: string,
  newSettings: NotificationSettings
) {
  await TokenModel.updateOne({ token }, newSettings, { upsert: true })
}

export async function getTokens(params?: Partial<TokenWithSettings>) {
  const tokens = await TokenModel.find({
    ...params,
    expired: false,
    token: { $regex: notificationTokenRegex },
  })
  return tokens.map(({ token }) => token.toString())
}

export const TokenModel = getModelForClass(TokenWithSettings)
