import { faker } from '@faker-js/faker'
import { apiClient } from "./apiClient"
import * as fetchFnFile from './fetchFn'
describe('apiClient function', () => {
  it.each([
    ["get" as const],
    ["post" as const],
  ])('Set method %s on request', async (method) => {
    const fakeUrl = faker.internet.url()
    const fetchFnStub = vi.fn();
    const emptyRequestBody = {}
    const emptyHeaderParam = undefined
    vi.spyOn(fetchFnFile, 'fetchFn').mockImplementation(fetchFnStub)
  
    if (method === 'get') {
      await apiClient[method](fakeUrl)
      expect(fetchFnStub).toHaveBeenCalledWith(method.toUpperCase(), fakeUrl, emptyHeaderParam)
    } else {
      await apiClient[method](fakeUrl, {})
      expect(fetchFnStub).toHaveBeenCalledWith(method.toUpperCase(), fakeUrl, emptyRequestBody, emptyHeaderParam)
    }
  })
})
