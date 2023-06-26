import { z } from 'zod'

export const UserSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),

  number: z
    .string()
    .length(6, {
      message: 'Number must be exactly 6 digits long',
    })
    .optional(),
})
