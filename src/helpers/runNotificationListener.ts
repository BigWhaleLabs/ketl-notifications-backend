import getObssContract from '@/helpers/getObssContract'
import sendAppleNotification from '@/helpers/sendAppleNotification'

const obssContract = getObssContract()
console.log('listen')
obssContract.on('ReactionAdded', () => {
  console.log('reactionAdded')
  void sendAppleNotification(
    'd80b5390a9d65768a11c0fbbb2caee25663f4e47d020395bb41f5642b7fb3eac',
    'ReactionAdded'
  )
})
obssContract.on('ReactionRemoved', () => {
  console.log('reactionRemoved')
  void sendAppleNotification(
    'd80b5390a9d65768a11c0fbbb2caee25663f4e47d020395bb41f5642b7fb3eac',
    'ReactionRemoved'
  )
})

obssContract.on('FeedPostAdded', () => {
  console.log('new feed post')
  void sendAppleNotification(
    'd80b5390a9d65768a11c0fbbb2caee25663f4e47d020395bb41f5642b7fb3eac',
    'FeedPostAdded'
  )
})
