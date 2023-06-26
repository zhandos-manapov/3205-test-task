import { z } from 'zod'
import './UserForm.css'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PatternFormat } from 'react-number-format'
import { getUsers } from '../../services/api.service'
import useSignal from '../../hooks/useSignal'
import Loader from '../Loader/Loader'
import useBigSignal from '../../hooks/useBigSignal'

const UserSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),

  number: z
    .string()
    .length(8, {
      message: 'Number must be exactly 6 digits long',
    })
    .regex(/\d{2}-\d{2}-\d{2}/, 'Invalid phone number')
    .transform((val) => val.replace(/-/g, ''))
    .optional(),
})

type User = z.infer<typeof UserSchema>

type FetchError = {
  error: boolean
  status: number
  message: string
}

function delay(timeout: number) {
  return new Promise((resolve) => setTimeout(resolve, timeout))
}

let controller: AbortController

export default function UserForm() {
  const fetchedUsers = useSignal<User[]>([])
  const loading = useSignal(false)
  const fetchError = useBigSignal<FetchError>({ error: false, status: -1, message: '' })
  const counter = useSignal(0)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(UserSchema),
  })

  const onSubmit = async (userQuery: User) => {
    // Cancel the previous request
    if (controller) controller.abort()
    await delay(0)

    // Start loader
    loading.val = true

    // Hide errors
    fetchError.error = false

    // Start request timer
    counter.val = 0
    const intervalID = setInterval(() => {
      counter.val = (prev) => prev + 1
    }, 1000)

    // Making a request
    controller = new AbortController()
    getUsers(controller.signal, userQuery)
      .then(({ data }) => {
        fetchedUsers.val = data
      })
      .catch((error) => {
        fetchedUsers.val = []
        fetchError.set({
          error: true,
          status: error.response?.status ?? -1,
          message: error.response?.data.message ?? error.message,
        })
        console.error(error)
      })
      .finally(() => {
        loading.val = false
        clearInterval(intervalID)
      })
  }

  return (
    <div>
      <form
        className='form'
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className='control'>
          <label>Email *</label>
          <input
            type='email'
            {...register('email')}
          />
          {errors.email && <span className='control-error'>{errors.email.message}</span>}
        </div>

        <div className='control'>
          <label>Number</label>
          <Controller
            name='number'
            control={control}
            render={({ field }) => (
              <PatternFormat
                format='##-##-##'
                {...field}
              />
            )}
          />
          {errors.number && <span className='control-error'>{errors.number.message}</span>}
        </div>

        <input type='submit' />
      </form>

      <hr />

      <div>Time: {counter.val} s</div>

      <div>
        {loading.val && (
          <div className='loader-wrapper'>
            <Loader />{' '}
          </div>
        )}

        {!loading.val && (
          <ul>
            {fetchedUsers.val.map((user, idx) => (
              <li key={idx}>
                <h3>{user.email}</h3>
                <p>{user.number}</p>
              </li>
            ))}
          </ul>
        )}

        {fetchError.error && <p className='error'>{`Status ${fetchError.status}: ${fetchError.message}`}</p>}
      </div>
    </div>
  )
}
