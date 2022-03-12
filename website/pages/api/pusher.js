import Cors from 'cors'
import { pusher } from './pusher/auth'
import initMiddleware from '../../lib/init-middleware'

const cors = initMiddleware(
  Cors({
    methods: ['POST'],
  })
)

const handler = async (req, res) => {
  await cors(req, res)
  const { channelName, eventName, data } = JSON.parse(req.body)
  pusher.trigger(channelName, eventName, data)
  return res.status(200).end()
}

export default handler
