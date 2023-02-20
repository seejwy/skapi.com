<template lang="pug">
sui-button(type="submit")
	Icon.animation-rotation--slow-in-out(v-if="props.loading") loading
	span(:style="{'visibility': props.loading ? 'hidden' : 'visible'}")
		slot
</template>
<script setup>
import Icon from './Icon.vue';

const props = defineProps(['loading']);
</script>
<style lang="less" scoped>
sui-button {
	width: auto;
}
svg {
	position: absolute;
	width: 24px;
	height: 24px;
	left: unset !important;
	vertical-align: middle;
	cursor: pointer;
}
</style>