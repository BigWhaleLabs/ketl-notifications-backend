import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'amala'

export default class {
  @IsString()
  @IsNotEmpty()
  token!: string
  @IsBoolean()
  @IsOptional()
  allPostsEnabled?: boolean
  @IsBoolean()
  @IsOptional()
  hotPostsEnabled?: boolean
  @IsBoolean()
  @IsOptional()
  repliesEnabled?: boolean
}
