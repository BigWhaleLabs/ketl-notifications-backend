import { Ref, getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import { Token, TokenModel } from '@/models/Token'
import notificationTokenRegex from '@/helpers/regexes'

interface Settings {
  allPostsEnabled: boolean
  hotPostsEnabled: boolean
  repliesEnabled: boolean
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class NotificationSettings {
  @prop({ ref: () => Token })
  public token?: Ref<Token>
  @prop({ default: true })
  public allPostsEnabled?: boolean
  @prop({ default: true })
  public hotPostsEnabled?: boolean
  @prop({ default: true })
  public repliesEnabled?: boolean
}

export function findSettingsByToken(token: Token) {
  return NotificationsSettingsModel.findOne({ token }, [
    'repliesEnabled',
    'hotPostsEnabled',
    'allPostsEnabled',
  ])
}

export async function createOrUpdateSettings(
  token: string,
  newSettings: Settings
) {
  await NotificationsSettingsModel.updateOne({ token }, newSettings, {
    upsert: true,
  })
}

export async function excludeTokensWithParams(
  params?: Partial<NotificationSettings>
) {
  const tokens = await TokenModel.find({
    token: { $not: { $regex: notificationTokenRegex } },
  })
  if (!params) return tokens.map(({ token }) => token.toString())
  const settings = await NotificationsSettingsModel.find(params)
  const tokenSet = new Set(settings.map(({ token }) => token?.toString()))
  return tokens
    .filter(({ _id }) => !tokenSet.has(_id.toString()))
    .map(({ token }) => token.toString())
}

export const NotificationsSettingsModel = getModelForClass(NotificationSettings)
