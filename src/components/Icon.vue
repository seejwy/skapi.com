<script>
import { ref, h, useSlots } from 'vue'

export default{
  props: {
    fill: {
      type: String,
      default: '#fff'
    }
  },
  setup(props) {
    const slots = useSlots();
    const count = ref(1);
    return () => h('svg', {
      style: `fill: ${props.fill}`
    }, [
      h('use', {
        'xlink:href': `/src/assets/img/icons/sprite.svg#${slots.default()[0].children}`,
        href: `/src/assets/img/icons/sprite.svg#${slots.default()[0].children}`, innerHTML: slots.default()[0].children
      })
    ])
  }
}
</script>
<style scoped>
svg {
  width: 18px;
  height: 18px;
}
</style>