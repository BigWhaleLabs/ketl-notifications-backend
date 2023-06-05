import { KetlAttestation__factory } from '@big-whale-labs/ketl-attestation-token'
import defaultProvider from '@/helpers/defaultProvider'
import env from '@/helpers/env'

export default KetlAttestation__factory.connect(
  env.KETL_ATTESTATION_CONTRACT,
  defaultProvider
)
