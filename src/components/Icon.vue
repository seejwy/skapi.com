<script>
import { ref, h, useSlots } from 'vue'

export default{
  setup() {
    const slots = useSlots();
    const count = ref(1);
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
  fill: inherit;
  width: 18px;
  height: 18px;
}
</style>