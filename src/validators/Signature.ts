import { IsString } from 'amala'

export default class {
  @IsString()
  message!: string
  @IsString()
  signature!: string
}
