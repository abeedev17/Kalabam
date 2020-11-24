import { ObjectId } from 'mongodb'
import { connectToDatabase } from '../db/mongodb'

const populateCreatedByAggregateStages = [
  {
    $lookup: {
      from: 'users',
      foreignField: '_id',
      localField: 'createdBy',
      as: 'createdBy_user'
    }
  },
  {
    $addFields: {
      user: { $arrayElemAt: ['$createdBy_user', 0] },
      questionCount: {
        $size: '$questions'
      }
    }
  },
  {
    $project: {
      createdBy_user: 0
    }
  }
]

export async function getGamesCreatedByUser (userId) {
  const { db } = await connectToDatabase()
  const collection = db.collection('games')

  const games = await collection
    .aggregate([
      {
        $match: {
          createdBy: new ObjectId(userId)
        }
      },
      ...populateCreatedByAggregateStages,
      { $sort: { _id: -1 } }
    ])
    .toArray()

  return games
}

export const createGame = async (newGame) => {
  const dateNow = new Date()

  const game = {
    ...newGame,
    created: dateNow,
    updated: dateNow
  }

  const { db } = await connectToDatabase()
  const collection = db.collection('games')

  return await collection.insertOne(game)
}
