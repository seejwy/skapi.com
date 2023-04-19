<template lang="pug">
sui-button(type="submit" :disabled="(props.loading || props.disabled) || null" :loading="props.loading || null")  
	LoadingAnimation(v-if="props.loading")
	span(:style="{'visibility': props.loading ? 'hidden' : 'visible'}")
		slot
	input(type="submit" style="position: absolute; opacity: 0; visibility: hidden")
</template>
<script setup>
import LoadingAnimation from './LoadingAnimation.vue';
const props = defineProps({
	loading: {
		type: Boolean,
		default() {
			return false;
		}
	},
	disabled: {
		type: Boolean,
		default() {
			return false;
		}
	}
})
</script>
<style lang="less" scoped>
sui-button {
	width: auto;

	&[loading] {
		filter: none;
	}
}
</style>