import { add } from '../../packages/shared/core/add' // Flow typed file

describe('Flow', () => {
  it('works', () => {
    // note: Flow definition
    const x = 42

    add(1, 'a') // Flow error
  })
})