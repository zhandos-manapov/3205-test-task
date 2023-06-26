import { Request, Response } from 'express'
import { UserSchema } from './user.schema'
import { User } from './user.model'
import { NotFoundError } from '../../errors'
import users from '../../db/users.json'
import { StatusCodes } from 'http-status-codes'

const delay = (timeout: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout))
}

export const getUsers = async (req: Request, res: Response) => {
  await delay(5000)

  const { email, number } = UserSchema.parse(req.query)

  let targetUsers: User[]
  if (number) {
    targetUsers = users.filter((user) => user.email === email && user.number === number)
  } else {
    targetUsers = users.filter((user) => user.email === email)
  }

  if (targetUsers.length <= 0) throw new NotFoundError('Users were not found')

  res.status(StatusCodes.OK).json(targetUsers)
}
