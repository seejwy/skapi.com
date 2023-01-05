<template lang="pug">
div(style="padding: 16px; box-sizing: border-box; position: relative;")
	.container
		.close(@click="$emit('close')")
			span.material-symbols-outlined close
		.title {{ props?.record?.record_id }}
		.menu
			ul
				li.menu-item(@click="view = 'information'" :class="{'active': view === 'information'}") Information
				li.menu-item(@click="view = 'record'" :class="{'active': view === 'record'}") Record
			.action(@click="overlay.open")
				span.material-symbols-outlined delete
				span delete
		.content
			.grid(v-if="view === 'information'")
				.grid-item.title Record ID 
				.grid-item {{ props?.record?.record_id }}
				.grid-item.title Table Name
				.grid-item {{ props?.record?.table }}
				.grid-item.title Access Group
				.grid-item {{ props?.record?.access_group === 'private' ? 'Private' : props?.record?.access_group ? 'Registered' : 'Public' }}
				.grid-item.title User ID
				.grid-item {{ props?.record?.user_id }}
				.grid-item.title Subscription
				.grid-item {{ props?.record?.subscription || '-' }}
				.grid-item.title Reference 
				.grid-item {{ props?.record?.reference || '-' }}
				.grid-item.title.span-2 Index
				.grid-item.title(style="font-weight: normal") Index Name
				.grid-item {{ props?.record?.index?.name || '-' }}
				.grid-item.title(style="font-weight: normal") Index Value
				.grid-item
					span.type(v-if="props?.record?.index?.value") {{ typeof props?.record?.index?.value }}
					span {{ props?.record?.index?.value || '-' }}
				.grid-item.title Upload Datetime
				.grid-item {{ dateFormat(props?.record?.uploaded) }}
				.grid-item.title Reference
				.grid-item
					.sub-grid Multiple Reference
						sui-input(type="checkbox" disabled :checked="props?.record?.config?.allow_multiple_reference || null")
					.sub-grid Reference Limit: {{ props?.record?.config?.reference_limit || '-' }}
				template(v-if="props?.record?.tags?.length")
					.grid-item.title.span-2 Tags
					.grid-item.span-2(style="padding-top: 4px;")
						.tags-wrapper
							.tag(v-for="tag in props?.record?.tags") {{ tag }}
				template(v-else)
					.grid-item.title Tags
					.grid-item -
				template(v-if="props?.record?.config?.private_access?.length")
					.grid-item.title.span-2 Access
					.grid-item.span-2(style="padding-top: 4px;")
						.tags-wrapper
							.tag(v-for="userId in props?.record?.config?.private_access") {{ userId }}
				template(v-else)
					.grid-item.title Access
					.grid-item -
			template(v-else)
				.data-row(v-for="(data, key) in props?.record?.data")
					.name
						span.type(v-if="data?.type || data[0]?.type") File
						span.type(v-else-if="typeof data === 'object'") JSON
						span.type(v-else) {{ typeof data }}
						span {{ key }}
					template(v-if="data?.type")
						.value.file(@click="download(data.url)")
							span.material-symbols-outlined file_present
							span
								div {{ data.filename }}
								div(v-if="data.size" style="font-size: 12px;") {{ getSize(data.size) }}
							span.material-symbols-outlined download
					template(v-else-if="data[0]?.type")
						.value.file(v-for="file in data" @click="download(file.url)")
							span.material-symbols-outlined file_present
							span
								div {{ file.filename }}
								div(v-if="file.size" style="font-size: 12px;") {{ getSize(file.size) }}
							span.material-symbols-outlined download
					template(v-else-if="typeof data === 'object'")
						pre.value {{ data }}
					template(v-else)
						.value {{ data }}
		.foot
			sui-button.line-button Edit
sui-overlay(ref="overlay")
	.popup
		.title
			span.material-symbols-outlined error
			div Are you sure?
		.body Are you sure you want to delete the record?
		.foot
			sui-button(@click="overlay.close") No 
			sui-button.line-button(@click="deleteRecord") Yes
</template>
<script setup>
import { ref } from 'vue';
import { dateFormat, getSize } from '@/main'

let props = defineProps({
	record: {
		type: Object,
		default: () => ({}),
	},
});

let emit = defineEmits(['close']);

const overlay = ref(null);
let view = ref('information');

const deleteRecord = () => {
	//perform non-awaiting delete here then close
	overlay.value.close();
}

const download = (url) => {
	const link = document.createElement('a');
	link.href = url;
	link.download = url.substring(url.lastIndexOf('/') + 1);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}
</script>
<style lang="less" scoped>
.container {
	background: #505050;
	border: 1px solid #808080;
	box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.25);
	border-radius: 8px;
	width: 500px;
	max-width: 100%;

	.close {
		position: absolute;
		right: 0;
		top: 0;
		background-color: #D9D9D9;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		color: #434343;
		cursor: pointer;

		.material-symbols-outlined {
			user-select: none;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}

	.title {
		padding: 18px 20px 24px 20px;
		font-weight: bold;
	}

	.menu {
		display: flex;
		justify-content: space-between;
		font-weight: bold;

		ul {
			margin: 0;
			padding: 0;
		}

		&-item {
			display: inline-flex;
			align-items: center;
			height: 40px;
			padding: 0 20px;
			border-radius: 8px 8px 0px 0px;
			cursor: pointer;
			
			&.active {
				background-color: #333333;
			}
		}

		.action {
			display: inline-flex;
			align-items: center;
			gap: 4px;
			padding: 0 20px;
			cursor: pointer;
			
			.material-symbols-outlined {
				font-size: 20px;
			}
		}
	}

	.content {
		background-color: #333333;
		padding: 30px 20px 20px 20px;
		height: 700px;
		max-height: calc(100vh - 250px);
		overflow-y: scroll;

		.grid {
			display: grid;
			grid-template-columns: auto 1fr;
			grid-template-rows: repeat(auto-fit);
			grid-column-gap: 20px;

			sui-input[type=checkbox],
			sui-input[type=checkbox][disabled] {
				filter: none;
				margin-left: 8px;
				border-color: rgba(255, 255, 255, 0.6);

				&[checked] {
					border: none;
					color: rgba(0, 0, 0, 0.5);
					background: rgba(255, 255, 255, 0.6);
					box-shadow: inset -1px -1px 2px rgba(0, 0, 0, 0.25);
				}
			}
		}

		.grid-item {
			grid-column: span 1;
			padding: 8px 0;

			&.span-2 {
				grid-column: span 2;
			}

			.sub-grid:not(:last-child) {
				margin-bottom: 12px;
			}

			&.title {
				font-weight: bold;
				color: rgba(255,255,255,.6);
			}
		}

		.data-row {
			margin-bottom: 72px;

			&:last-child {
				margin-bottom: 36px;
			}

			.value {
				margin-top: 20px;
				padding: 16px 20px;
				background: #434343;
				border-radius: 8px;

				&.file {
					display: flex;
					padding: 16px 20px 16px 12px;
					gap: 16px;

					
					span:first-child,
					span:last-child {
						color: rgba(255, 255, 255, .6);
					}

					span:first-child {
						font-size: 46px;
					}

					span:nth-child(2) {
						flex-grow: 1;
					}
					span:last-child {
						font-size: 24px;
						align-self: center;
						cursor: pointer;
					}
				}

				.material-symbols-outlined {
					user-select: none;
				}
			}

			&:not(:last-child)::after {
				content: '';
				display: block;
				position: relative;
				top: 36px;
				height: 2px;
				width: 100%;
				background-color: rgba(255, 255, 255, 0.08);
			}
		}
	}

	.foot {
		text-align: center;
		padding: 20px;
	}

	.tags-wrapper {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		background: #434343;
		border-radius: 4px;
		padding: 12px 16px;

		.tag {
			display: inline-block;
			padding: 4px 8px;
			background: #D9D9D9;
			color: rgba(0, 0, 0, 0.65);
			border: 0.5px solid #8C8C8C;
			box-shadow: inset -1px -1px 2px rgba(0, 0, 0, 0.25), inset 1px 1px 2px rgba(255, 255, 255, 0.65);
			border-radius: 4px;
		}
	}
}
.popup {
	background: #333333;
	border: 1px solid #808080;
	box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.25);
	border-radius: 8px;
	padding: 60px 32px;
	margin: 12px;
	text-align: center;

	.material-symbols-outlined {
		font-size: 38px;
	}
	
	.title {
		color: #FF8D3B;

		& > div {
			margin-top: 12px; 
			font-size: 20px;
		}
	}
	
	.body {
		padding: 20px 0 28px 0;
	}

	.foot sui-button:first-child {
		margin-right: 12px;
	}
}
.type {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	margin-right: 12px;
	text-transform: capitalize;
	border: 1px solid #FFFFFF;
	border-radius: 4px;
	height: 28px;
	font-size: 14px;
	padding: 0 8px;
	min-width: 72px;
}
</style>