import { shallowMount } from '@vue/test-utils'
import Info from '@/components/Info.vue'

describe('Info component', () => {
  it('renders props.mal when passed', () => {
    const mal = {
      title: 'Naruto',
      aired: 'Oct 3, 2002 to Feb 8, 2007',
      episodes: '220'
    }

    const wrapper = shallowMount(Info, {
      propsData: {
        mal
      }
    })

    expect(wrapper.text()).toContain(mal.title)
    expect(wrapper.text()).toContain(mal.aired)
    expect(wrapper.text()).toContain(mal.episodes)
  })
})
