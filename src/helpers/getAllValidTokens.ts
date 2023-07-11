import { TokenModel } from '@/models/Token'

const apnRegex = /^[a-f0-9]{64}$/

export default async function () {
  const tokens = await TokenModel.distinct('token')
  return tokens.filter(apnRegex.test)
}
