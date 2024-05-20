import { apiClient } from "@/lib/apiClient"
import { StatusCodes } from "http-status-codes"
import { UNAUTHORIZED_ERROR_MESSAGE, authAssignor } from "./authAssignor"

describe('authAssignor', () => {
  it('return a specific error message if api client return unauthorized code', async () => {
    vi.spyOn(apiClient, 'post')
      .mockImplementation(async () => ({ data: null, error: { status: StatusCodes.UNAUTHORIZED, message: '' } }))

    const { error } = await authAssignor({
      login: 'WRONG',
      password: 'WRONG'
    })

    expect(error).toStrictEqual(UNAUTHORIZED_ERROR_MESSAGE)
  })
  it('Repass token field if success', async () => {
    const expectedReturnDataObject = { token: 'GOOD_TOKEN' }
    vi.spyOn(apiClient, 'post')
      .mockImplementation(async () => ({ data: expectedReturnDataObject, error: null }))

    const { data } = await authAssignor({
      login: 'CORRECT',
      password: 'CORRECT'
    })

    expect(data).toStrictEqual(expectedReturnDataObject)
  })
  it('Repass error message if api client return a untracked error', async () => {
    const expectedErrorMessage = 'RANDOM_ERROR'
    vi.spyOn(apiClient, 'post')
      .mockImplementation(async () => ({ data: null, error: { message: expectedErrorMessage, status: 999 } }))

    const { error } = await authAssignor({
      login: 'CORRECT',
      password: 'CORRECT'
    })

    expect(error).toStrictEqual(expectedErrorMessage)
  })
})