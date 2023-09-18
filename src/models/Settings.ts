import { Ref, getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import { Token } from '@/models/Token'

@modelOptions({
  schemaOptions: { timestamps: true },
})
export class Settings {
  @prop({ ref: () => Token, type: () => String })
  public token?: Ref<Token, string>
  @prop({ default: true })
  public allPostsEnabled?: boolean
  @prop({ default: true })
  public hotPostsEnabled?: boolean
  @prop({ default: true })
  public repliesEnabled?: boolean
}

export function findOne(token: Token) {
  return SettingsModel.findOne(
    {
      token,
    },
    ['repliesEnabled', 'hotPostsEnabled', 'allPostsEnabled']
  )
}

export async function findOneOrCreate(token: Token) {
  const setting = await findOne(token)

  if (setting) return setting

  await SettingsModel.create({ token })

  return findOne(token)
}

export const SettingsModel = getModelForClass(Settings)
