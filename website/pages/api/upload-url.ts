import type { NextApiHandler } from 'next'
import aws from 'aws-sdk'
import uniqid from 'uniqid'
import { getUserFromSession } from '../../models/User'

aws.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: process.env.S3_REGION,
  signatureVersion: 'v4',
})

const s3 = new aws.S3()

const handler: NextApiHandler = async (req, res) => {
  let user
  try {
    user = await getUserFromSession({ req })
  } catch {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const file = req.query.file as string
  const imageKey = `img-${uniqid()}.${file.split('.').pop().toLowerCase()}`
  const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${imageKey}`

  const post = s3.createPresignedPost({
    Bucket: process.env.S3_BUCKET_NAME,
    Fields: {
      key: imageKey,
    },
    Expires: 60, // seconds
    Conditions: [
      ['eq', '$x-amz-meta-userid', user.id],
      ['content-length-range', 0, 2097152], // up to 2 MB
    ],
  })

  post.fields['x-amz-meta-userid'] = user.id

  res.status(200).json({ post, imageUrl })
}

export default handler