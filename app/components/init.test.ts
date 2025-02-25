import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Test from './Test.vue'

describe('Test init', () => {
  it('should success', () => {
    const wrapper = mount(Test, {
      props: {
        title: 'Mino'
      }
    })
    const title = wrapper.find('[data-testid="title"]')
    expect(title.text()).toBe('Mino')
  })
})
