import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
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
}

interface Settings {
  allPostsEnabled?: boolean
  hotPostsEnabled?: boolean
  repliesEnabled?: boolean
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
  newSettings: Settings
) {
  await TokenModel.updateOne({ token }, newSettings, { upsert: true })
}

export async function excludeTokensWithParams(
  params?: Partial<TokenWithSettings>
) {
  const tokens = await TokenModel.find({
    token: { $not: { $regex: notificationTokenRegex } },
  })
  if (!params) return tokens.map(({ token }) => token.toString())
  const settings = await TokenModel.find(params)
  const tokenSet = new Set(settings.map(({ token }) => token?.toString()))
  return tokens
    .filter(({ _id }) => !tokenSet.has(_id.toString()))
    .map(({ token }) => token.toString())
}

export const TokenModel = getModelForClass(TokenWithSettings)
