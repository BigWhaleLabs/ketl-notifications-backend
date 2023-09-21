import { IsBoolean } from 'amala'

export default class {
  @IsBoolean()
  allPostsEnabled!: boolean
  @IsBoolean()
  hotPostsEnabled!: boolean
  @IsBoolean()
  repliesEnabled!: boolean
}
