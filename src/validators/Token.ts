import { IsNotEmpty, IsString } from 'amala'

export default class {
  @IsNotEmpty({ always: true })
  @IsString({ always: true })
  token!: string
}
