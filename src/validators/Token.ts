import { IsNotEmpty, IsString } from 'amala'

export default class {
  @IsString()
  @IsNotEmpty()
  token!: string
}
