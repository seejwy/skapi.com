<script>
import { ref, h, useSlots } from 'vue'

export default{
  setup() {
    const slots = useSlots();
    return () => h('svg', [
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
  fill: currentColor;
  width: 20px;
  height: 20px;
  vertical-align: middle;
}
</style>