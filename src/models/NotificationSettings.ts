export default interface NotificationSettings {
  allPostsEnabled?: boolean
  hotPostsEnabled?: boolean
  repliesEnabled?: boolean
}

export const allDisabledNotificationSettings = {
  allPostsEnabled: false,
  hotPostsEnabled: false,
  repliesEnabled: false,
}
