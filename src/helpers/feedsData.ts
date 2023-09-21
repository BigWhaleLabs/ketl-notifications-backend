import env from '@/helpers/env'

type FeedIdToName = { [feedId: number]: string }

export const productionFeeds: FeedIdToName = {
  1: 't/startups',
  2: 't/ketlTeam',
}

export const developmentFeeds: FeedIdToName = {
  0: 't/devFeed',
  ...productionFeeds,
}

export const rootFeeds = env.isProduction ? productionFeeds : developmentFeeds
