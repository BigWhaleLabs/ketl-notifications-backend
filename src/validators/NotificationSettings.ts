import { IsBoolean, IsNotEmpty, IsString } from 'amala'

export default class {
  @IsString()
  @IsNotEmpty()
  token!: string
  @IsBoolean()
  allPostsEnabled!: boolean
  @IsBoolean()
  hotPostsEnabled!: boolean
  @IsBoolean()
  repliesEnabled!: boolean
}
