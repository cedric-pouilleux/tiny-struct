import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LoginItem, { type LoginItemType } from './LoginItem.vue'

function prepareComponent(props?: LoginItemType) {
  return shallowMount(LoginItem, {
    props: {
      name: 'Cedric Pouilleux',
      avatar: '/test.jpg'
    },
    global: {
      stubs: {
        Icon: true
      }
    }
  })
}

describe('LoginItem component', () => {
  it('should display full name', () => {
    const wrapper = prepareComponent()
    expect(wrapper.find('[data-testid="login-name"').text()).contain('Cedric Pouilleux')
  })

  it('should display picture in image', () => {
    const wrapper = prepareComponent()
    expect(wrapper.find('[data-testid="login-avatar"').attributes('src')).toBe('/test.jpg')
  })
})
