import { parsePath } from '..'

describe('Index Tests', () => {
  test('Test module access by default index ', () => {
    expect(parsePath).toBeDefined()
  })
})
