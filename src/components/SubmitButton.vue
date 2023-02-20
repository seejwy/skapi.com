<template lang="pug">
sui-button(type="submit" :disabled="props.loading || null")
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

	&[disabled] {
		box-shadow: rgb(255 255 255 / 50%) 1px 1px 2px inset, rgb(0 0 0 / 25%) -1px -1px 2px inset, rgb(0 0 0 / 25%) 0px 0px 0px 1px inset;
		filter: none;
	}
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