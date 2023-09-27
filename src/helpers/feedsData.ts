import env from '@/helpers/env'

type FeedIdToName = { [feedId: number]: string }

const productionFeeds: FeedIdToName = {
  1: 't/startups',
  2: 't/ketlTeam',
}

const developmentFeeds: FeedIdToName = {
  0: 't/devFeed',
  ...productionFeeds,
}

const feedsData = env.isProduction ? productionFeeds : developmentFeeds

export default feedsData
