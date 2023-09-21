import { Ref, getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import { Token } from '@/models/Token'

@modelOptions({
  schemaOptions: { timestamps: true },
})
export class Settings {
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
  return SettingsModel.findOne(
    {
      token,
    },
    ['repliesEnabled', 'hotPostsEnabled', 'allPostsEnabled']
  )
}

export async function findOneOrCreate(token: Token) {
  const setting = await findSettingsByToken(token)

  if (setting) return setting

  await SettingsModel.create({ token })

  return findSettingsByToken(token)
}

export async function createOrUpdateSettings(
  token: Token,
  {
    allPostsEnabled,
    hotPostsEnabled,
    repliesEnabled,
  }: {
    allPostsEnabled: boolean
    hotPostsEnabled: boolean
    repliesEnabled: boolean
  }
) {
  await SettingsModel.updateOne(
    { token },
    {
      allPostsEnabled,
      hotPostsEnabled,
      repliesEnabled,
    },
    {
      upsert: true,
    }
  )
}

export async function deleteSettings(token: Token) {
  await SettingsModel.deleteOne({ token })
}

export const SettingsModel = getModelForClass(Settings)
