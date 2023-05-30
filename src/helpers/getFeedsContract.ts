import { Feeds__factory } from '@big-whale-labs/obss-storage-contract'
import defaultProvider from '@/helpers/defaultProvider'
import env from '@/helpers/env'

export default Feeds__factory.connect(
  env.OBSS_STORAGE_CONTRACT_FEEDS,
  defaultProvider
)
