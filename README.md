# Notifications backend for Ketl

## Installation and local launch

1. Clone this repo: `git clone https://github.com/BigWhaleLabs/ketl-notifications-backend`
2. Launch the [mongo database](https://www.mongodb.com/) locally
3. Obtain the necessary credentials:
   - For sending iOS notifications, you need to get the `APN.p8` file and set the `APN_KEY_ID` and `APN_TEAM_ID` environment variables. See [Apple's documentation](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/ orestablishing_a_certificate-based_connection_to_apns) or [node-apn](https://github.com/node-apn/node-apn/blob/master/doc/provider.markdown) documentation for instructions.
   - For sending Firebase notifications, you need to get the `firebase-account.json` file. See [Firebase's documentation](https://firebase.google.com/docs/admin/setup#initialize_the_sdk) for instructions.
4. Create `.env` with the environment variables listed below
5. Run `yarn` in the root folder
6. Run `yarn start`

And you should be good to go! Feel free to fork and submit pull requests.

## Environment variables

| Name                  | Description                                                        |
| --------------------- | ------------------------------------------------------------------ |
| `MONGO`               | URL of the mongo database                                          |
| `PORT`                | Port to run server on (defaults to 1337)                           |
| `APN_KEY_ID`          | APN key ID for sending iOS notifications                           |
| `APN_TEAM_ID`         | APN team ID for sending iOS notifications                          |
| `BUNDLE_ID`           | Bundle ID for iOS notifications                                    |
| `ETH_RPC`             | Ethereum RPC endpoint for notifications                            |
| `ETH_NETWORK`         | Ethereum network for notifications                                 |
| `NODE_ENV`            | ENV of the project. Could be "development", "production" or "test" |
| `IPFS_GATEWAY`        | IPFS gateway for resolving content                                 |
| `HEALTHCHECK_WEBHOOK` | Webhook for healthcheck                                            |

Also, please, consider looking at `.env.sample`.
