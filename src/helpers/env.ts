import * as dotenv from 'dotenv'
import {
  ETH_RPC as BWL_ETH_RPC,
  ETH_MUMBAI_NETWORK,
  PROD_KETL_OBSS_CONTRACT_ADDRESS,
} from '@big-whale-labs/constants'
import { cleanEnv, num, str } from 'envalid'
import { cwd } from 'process'
import { resolve } from 'path'

dotenv.config({ path: resolve(cwd(), '.env') })

// eslint-disable-next-line node/no-process-env
export default cleanEnv(process.env, {
  APN_KEY_ID: str(),
  APN_TEAM_ID: str(),
  BUNDLE_ID: str(),
  ETH_NETWORK: str({ default: ETH_MUMBAI_NETWORK }),
  ETH_RPC: str({ default: BWL_ETH_RPC }),
  MONGO: str(),
  OBSS_STORAGE_CONTRACT: str({
    default: PROD_KETL_OBSS_CONTRACT_ADDRESS,
  }),
  PORT: num({ default: 1337 }),
})
