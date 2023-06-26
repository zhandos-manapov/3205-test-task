import { z } from 'zod'

export const UserSchema = z.object({
  email: z.string().email(),
  number: z.string().length(6, { message: 'Number must be exactly 6 digits long' }).optional(),
})



try {
  const res = UserSchema.parse({email: 'zandosmanapovgmail.com', number: '1234567'})
  console.log(res)
} catch (error) {
  console.log(error)
}