import { OBSSStorage__factory } from '@big-whale-labs/obss-storage-contract'
import defaultProvider from '@/helpers/defaultProvider'
import env from '@/helpers/env'

export default function () {
  return OBSSStorage__factory.connect(
    env.OBSS_STORAGE_CONTRACT,
    defaultProvider
  )
}
