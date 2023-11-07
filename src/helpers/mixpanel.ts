import * as Mixpanel from 'mixpanel'
import env from '@/helpers/env'

export default Mixpanel.init(env.MIXPANEL_PROJECT_TOKEN)
