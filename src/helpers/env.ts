import * as dotenv from 'dotenv'
import {
  ETH_RPC as BWL_ETH_RPC,
  ETH_MUMBAI_NETWORK,
  KETL_VIEWS_BACKEND,
  PROD_KETL_ATTESTATION_CONTRACT,
  PROD_KETL_FEEDS_CONTRACT_ADDRESS,
  PROD_KETL_OBSS_CONTRACT_ADDRESS,
} from '@big-whale-labs/constants'
import { bool, cleanEnv, num, str } from 'envalid'
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
  IPFS_GATEWAY: str({ default: 'https://ipfs.sealcred.xyz/ipfs' }),
  KETL_ATTESTATION_CONTRACT: str({
    default: PROD_KETL_ATTESTATION_CONTRACT,
  }),
  KETL_VIEWS_BACKEND: str({ default: KETL_VIEWS_BACKEND }),
  MIXPANEL_PROJECT_TOKEN: str(),
  MONGO: str(),
  OBSS_STORAGE_CONTRACT: str({
    default: PROD_KETL_OBSS_CONTRACT_ADDRESS,
  }),
  OBSS_STORAGE_CONTRACT_FEEDS: str({
    default: PROD_KETL_FEEDS_CONTRACT_ADDRESS,
  }),
  PASSWORD: str(),
  PORT: num({ default: 1337 }),
  PRODUCTION: bool({ default: false }),
})
