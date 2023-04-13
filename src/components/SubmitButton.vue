<template lang="pug">
sui-button(type="submit" :disabled="(props.loading || props.disabled) || null")  
	svg(v-if="props.loading" width="16", height="16")
		circle(cx="12", cy="12", r="8", stroke="#FFF", stroke-width="2.5", fill="none", stroke-linecap="round")
	span(:style="{'visibility': props.loading ? 'hidden' : 'visible'}")
		slot
	input(type="submit" style="position: absolute; opacity: 0; visibility: hidden")
</template>
<script setup>

const props = defineProps(['loading', 'disabled']);
</script>
<style lang="less" scoped>
sui-button {
	width: auto;

	&[disabled]:not(.line-button) {
		box-shadow: rgb(255 255 255 / 50%) 1px 1px 2px inset, rgb(0 0 0 / 25%) -1px -1px 2px inset, rgb(0 0 0 / 25%) 0px 0px 0px 1px inset;
		background-color: var(--primary-color);
		filter: none;
	}

	svg {
		position: absolute;
		width: 24px;
		height: 24px;
		left: unset !important;
		vertical-align: middle;
		cursor: pointer;

		circle {
            stroke-dasharray: 50, 50;
            stroke-dashoffset: 10;
            transform: rotate(-90deg);
            transform-origin: 50% 50%;
            animation: animate 1s linear infinite;
        }

        @keyframes animate {
			0% {
				stroke-dashoffset: 50;
				stroke-dasharray: 50, 50;
			}
			50% {
				stroke-dashoffset: 0;
				stroke-dasharray: 20, 50;
			}
			100% {
				stroke-dashoffset: -50;
				stroke-dasharray: 50, 50;
			}
		}
	}
}
</style>