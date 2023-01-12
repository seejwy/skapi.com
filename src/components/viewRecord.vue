<template lang="pug">
div(style="padding: 16px; box-sizing: border-box; position: relative;" v-if="props?.record")
	.container(v-if="!isEdit")
		.close(@click="close")
			span.material-symbols-outlined close
		.title {{ props.record.record_id }}
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
				.grid-item {{ props.record.record_id }}
				.grid-item.title Table Name
				.grid-item {{ props.record.table }}
				.grid-item.title Access Group
				.grid-item {{ props.record.access_group === 'private' ? 'Private' : props.record.access_group ? 'Registered' : 'Public' }}
				.grid-item.title User ID
				.grid-item {{ props.record.user_id }}
				.grid-item.title Subscription
				.grid-item {{ props.record.subscription || '-' }}
				.grid-item.title Reference 
				.grid-item {{ props.record.reference || '-' }}
				.grid-item.title.span-2 Index
				.grid-item.title(style="font-weight: normal") Index Name
				.grid-item {{ props.record.index?.name || '-' }}
				.grid-item.title(style="font-weight: normal") Index Value
				.grid-item
					span.type(v-if="props.record.index?.value") {{ typeof props.record.index.value }}
					span {{ props.record.index.value || '-' }}
				.grid-item.title Upload Datetime
				.grid-item {{ dateFormat(props.record.uploaded) }}
				.grid-item.title Reference
				.grid-item
					.sub-grid Multiple Reference
						sui-input(type="checkbox" disabled :checked="props.record.config?.allow_multiple_reference || null")
					.sub-grid Reference Limit: {{ (typeof props.record.config?.reference_limit === 'number') ? props.record.config.reference_limit : '-' }}
				template(v-if="props.record.tags?.length")
					.grid-item.title.span-2 Tags
					.grid-item.span-2(style="padding-top: 4px;")
						.tags-wrapper
							.tag(v-for="tag in props.record?.tags") {{ tag }}
				template(v-else)
					.grid-item.title Tags
					.grid-item -
				
				// private_access temporarily removed. will be brought back with better scalable structure
				//- template(v-if="props.record.config?.private_access?.length")
				//- 	.grid-item.title.span-2 Access
				//- 	.grid-item.span-2(style="padding-top: 4px;")
				//- 		.tags-wrapper
				//- 			.tag(v-for="userId in props.record.config?.private_access") {{ userId }}
				//- template(v-else)
				//- 	.grid-item.title Access
				//- 	.grid-item -
			template(v-else-if="view === 'record' && props.record?.data")
				.data-row(v-for="(data, key) in props.record.data")
					.name
						span.type(v-if="data?.type || data?.[0]?.type") File
						span.type(v-else-if="typeof data === 'object'") JSON
						span.type(v-else) {{ typeof data }}
						span {{ key }}
					template(v-if="data?.md5")
						a.value.file(:href="data.url" style="text-decoration: none;color: unset;")
							span.material-symbols-outlined file_present
							span
								.filename {{ data.filename }}
								div(v-if="data.size" style="font-size: 12px;") {{ getSize(data.size) }}
							span.material-symbols-outlined download
					template(v-else-if="data?.[0]?.md5")
						a.value.file(v-for="file in data" :href="file.url" style="text-decoration: none;color: unset;")
							span.material-symbols-outlined file_present
							span
								.filename {{ file.filename }}
								div(v-if="file.size" style="font-size: 12px;") {{ getSize(file.size) }}
							span.material-symbols-outlined download
					template(v-else-if="typeof data === 'object'")
						pre.value {{ data }}
					template(v-else)
						.value {{ data }}
		.foot
			sui-button.line-button(@click="editRecord") Edit
	.container(v-else)
		form(@submit.prevent="save")
			.close(@click="close")
				span.material-symbols-outlined close

			.title {{ form.record_id }}
			.menu
				ul
					li.menu-item(@click="() => view = 'information'" :class="{'active': view === 'information'}") Setting
					li.menu-item(@click="() => view = 'record'" :class="{'active': view === 'record'}") Record

			.content(v-show="view === 'information'")
				.row
					.section(style="width: 100%;")
						.name Table Name
						sui-input(required :value="form.table" @input="(e) => form.table = e.target.value")

				.row
					.section
						.name Reference ID
							span(style="float: right;") ?
						sui-input(:value="form.reference" @input="(e) => form.reference = e.target.value")
					.section
						.name Access Group
						sui-select(:value="form.access_group.toString()" @change="(e) => form.access_group = e.target.value" style="min-width: 160px;")
							option(value="0") Everyone 
							option(value="1") Registered Users

				.row
					.section(style="width: 100%;")
						.name Tags 
						TagsInput(:value="form.tags" @change="(value) => form.tags = value")

				.row
					.section(style="width: 100%;")
						.name Index Name 
						sui-input(
							:required="form.index.value !== '' ? true : null"
							:value="form.index.name"
							@input="(e)=> form.index.name = e.target.value")

				.row
					.section
						.name Index Value
						.row(style="row-gap: 16px;")
							.section
								sui-select(style="min-width: 100px;" :value="(typeof form.index.value)")
									option(value="string") String
									option(value="number") Number
									option(value="boolean") Boolean
							.section
								sui-input(
									:required="form.index.name !== '' ? true : null"
									:value="form.index.value"
									@input="(e)=> form.index.value = e.target.value")

				.row
					.section
						.name(style="display: flex; align-items: center;")
							sui-input#allow_reference(
								type="checkbox" 
								style="margin-right: 8px; vertical-align: middle;"
								@change="e=>form.config.reference_limit = e.target.checked ? null : 0"
								:checked="form.config.reference_limit !== 0 ? true : null")

							label(for="allow_reference") Allow Reference

						.reference-container(v-if="allowReference")
							div
								label(for="allow_multiple_reference" style="margin-right: 8px;") Allow Multiple Reference
								sui-input#allow_multiple_reference(
									type="checkbox"
									@input="(e)=>form.config.allow_multiple_reference = e.target.checked")

							div
								span Reference Limit:
								input.line-input(
									type="number"
									min="1"
									placeholder="Infitite"
									:value="form.config.reference_limit === null ? '' : form.config.reference_limit.toString()"
									@input="(e) => form.config.reference_limit = e.target.value ? parseInt(e.target.value) : null")

				// private_access temporarily removed. will be brought back with better scalable structure
				//- .row
				//- 	.section(style="width: 100%;")
				//- 		.name Access 
				//- 		TagsInput(:value="form.private_access" @change="(value) => form.private_access = value")

			.content(v-show="view === 'record'")
				.data-row(v-for="(row, index) in data")
					.data-name-action
						.select-input
							.select-field
								sui-select(:value="row.type" @change="(e) => row.type = e.target.value")
									option(value="string") String
									option(value="number") Number
									option(value="boolean") Boolean
									option(value="file") File
									option(value="json") JSON
							.input-field
								sui-input(type="text" :value="row.key" @input="(e)=>row.key = e.target.value")
						.action(@click="data.splice(index, 1)")
							span.material-symbols-outlined delete
							span.hideOnTablet remove
					.data-values 
						template(v-if="row.type === 'file'")
							.file-upload-area(@dragenter.stop.prevent="" @dragover.stop.prevent="" @drop.stop.prevent="onDrop($event, index)" @click="openFileInput(index)")
								input(style="display: none;" type="file" :name="row.key"  @change="addFiles($event, index)" multiple)
								div
									span.material-symbols-outlined(style="font-size: 57px") file_present
									span.hideOnTablet(style="margin-right: 6px;") Drag and Drop OR  
									sui-button.line-button(@click.prevent.stop="" type="button") Upload
							.value.file(v-for="(file, index) in row.value")
								span.material-symbols-outlined file_present
								span
									.filename {{ file.name || file.filename }}
									div(v-if="file.size" style="font-size: 12px;") {{ getSize(file.size) }}
								span.material-symbols-outlined(@click="row.value.splice(index, 1)") cancel

						.data-input-field(v-else-if="row.type === 'json'")
							sui-input(:value="row.value" @input="e => { row.value = e.target.value; e.target.setCustomValidity('')}" @change="validateJson")

						.data-input-field.transparent.boolean(v-else-if="row.type === 'boolean'")
							div Value:
							div
								label True
								sui-input(type="radio" :name="row.key" value="true" :checked="row.value === true ? true : null")
							div
								label False
								sui-input(type="radio" :name="row.key" value="false" :checked="row.value !== true ? true : null")

						.data-input-field(v-else-if="row.type === 'number'")
							sui-input(type='number' :name="row.key" :value="row.value")

						.data-input-field(v-else)
							sui-input(:name="row.key" :value="row.value")
				div
					sui-button.line-button(type="button" style="width: 100%;" @click.prevent="data.push({key: '', type: 'string', value: ''})") Add Data

			.foot
				sui-button(type="button" @click="isEdit = false" style="margin-right: 16px;").line-button Cancel
				sui-input(type="submit") Save

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
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { skapi, dateFormat, getSize } from '@/main';
import TagsInput from '@/components/TagsInput.vue';

const route = useRoute();
const props = defineProps(['record']);
const emit = defineEmits(['close']);
const overlay = ref(null);

const serviceId = route.params.service;
const view = ref('information');
const isEdit = ref(false);
const form = ref({});
const data = ref([]);

const allowReference = computed(() => {
	if(form.value.config?.reference_limit === 0) return false;
	return true;
});

const editRecord = () => {
	if (!props?.record) {
		return;
	}

	let record = JSON.parse(JSON.stringify(props.record));
	form.value = {};

	for (let k of [
		'record_id',
		'access_group',
		'table',
		// 'subscription_group', (not for admin)
		'reference',
		'index',
		'tags',
		'config'
	]) {
		if (record.hasOwnProperty(k)) {
			form.value[k] = record[k];

			if (k === 'config') {
				if (!record.config.hasOwnProperty('reference_limit')) {
					form.value.config.reference_limit = null;
				}
			}
		} else if (k === 'index') {
			form.value.index = {
				name: '',
				value: ''
			};
		}
	}

	if (record?.data) {
		data.value = Object.keys(record.data).map(key => {
			let keyValue = record.data[key];
			let value = keyValue;
			let type = (() => {
				if (keyValue?.md5 || keyValue?.[0]?.md5) {
					value = Array.isArray(keyValue) ? keyValue : [keyValue];
					return 'file';
				}

				let dataType = typeof keyValue;
				if (dataType === 'object') {
					value = JSON.stringify(value, null, 2);
					return 'json';
				}

				value = value.toString();
				return dataType;
			})();

			return { key, type, value };
		});
		
		console.log({data: data.value});
	}

	else {
		data.value = [];
	}

	isEdit.value = true;
};

const save = (e) => {
	Object.assign(form.value, {
		service: serviceId,
		formData: form => {
			for (let item of data.value) {
				if (item.type === 'json') {
					// append json data as binary
					form.append(item.key, new Blob([item.value], {
						type: 'application/json'
					}));
				} else if(item.type === 'file' && item.value) {
					if(Array.isArray(item.value)) {
						item.value.forEach(file => {
							if(file instanceof File) {
								form.append(item.key, file);
							} else {
								form.append(item.key, new Blob([JSON.stringify(file)], {
									type: 'application/json'
								}));
							}
						});
					} else {
						form.append(item.key, new Blob([JSON.stringify(item.value)], {
							type: 'application/json'
						}));
					}
				}
			}

			return form;
		}

	});

	if (!form.value.index?.name) {
		form.value.index = null; // set to null to remove index
	}

	skapi.postRecord(data.value.length ? e.target : null, form.value).then(r => {
		for(let k in r) {
			props.record[k] = r[k];
		}
		isEdit.value = false;
	});
};

const onDrop = (event, index) => {
	const files = event.dataTransfer.files;
	for (let i = 0; i < files.length; i++) {
		const file = files[i];
	}
	data.value[index].value = [...data.value[index].value, ...files];
}

const addFiles = (event, index) => {
	const files = event.target.files;
	for (let i = 0; i < files.length; i++) {
		const file = files[i];
	}
	data.value[index].value = [...data.value[index].value, ...files];
	event.target.value = '';
}

const openFileInput = (index) => {
	document.getElementsByName(data.value[index].key)[0].click();
}

const validateJson = (event) => {
	if(event.target.value === '') event.target.setCustomValidity('');
	try {
		JSON.parse(event.target.value);
		event.target.setCustomValidity('');
	} catch (e) {
		event.target.setCustomValidity('Invalid JSON');
	}
}

const close = () => {
	isEdit.value = false;
	view.value = 'information';
	emit('close');
}

defineExpose({
	close
});

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
				color: rgba(255, 255, 255, .6);
			}
		}

		.data-row {
			margin-bottom: 72px;

			.action {
				float: right;
			}

			&:last-child {
				margin-bottom: 36px;
			}

			.data-input-field,
			.value {
				margin-top: 20px;
				padding: 16px 20px;
				background: #434343;
				border-radius: 8px;

				&.file {
					display: flex;
					padding: 16px 20px 16px 12px;
					gap: 16px;
					.filename {
						margin-bottom: 8px;
					}
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

					.material-symbols-outlined:last-child {
						font-size: 20px;
						font-variation-settings: 'FILL' 1;
					}
				}

				.material-symbols-outlined {
					user-select: none;
				}

				sui-input {
					padding: 0;

					&:not([type=radio]) {
						width: 100%;
						box-shadow: none;

						& input:focus {
							outline: none;
						}
					}

					&[type=radio] {
						cursor: pointer;
						color: #fff;
					}
				}

				&.transparent {
					background: none;
					padding: 0;
				}

				&.boolean {
					display: flex;
					gap: 20px;

					label {
						margin-right: 8px;
					}
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

			.data-name-action {
				display: flex;
				align-items: center;
				gap: 12px;

				.select-input {
					flex-grow: 1;
					text-align: center;

					sui-select {
						width: 6.5em;
					}
				}

				.action {
					cursor: pointer;

					.material-symbols-outlined {
						font-size: 20px;
						margin-right: 10px;
					}
				}
			}

			.file-upload-area {
				display: flex;
				align-items: center;
				justify-content: center;
				margin: 28px 0;
				border: 1px dashed #FFFFFF;
				border-radius: 8px;
				height: 100px;

				&:only-child {
					margin-bottom: 0;
				}

				& > div > * {
					display: inline-block;

					&:first-child {
						margin-right: 6px;
					}

					&:last-child {
						margin-left: 6px;
					}
				}
			}
		}

		.row {
			display: flex;
			width: 100%;
			row-gap: 24px;
			column-gap: 16px;
			flex-wrap: wrap;

			&:not(:last-child) {
				margin-bottom: 25px;
			}

			sui-select,
			sui-input:not([type=checkbox]) {
				width: 100%;
			}
		}

		.section {
			display: inline-block;
			flex-grow: 1;

			.name {
				margin-bottom: 8px;
				font-weight: bold;
			}

			.reference-container {
				display: flex;
				flex-wrap: wrap;
				gap: 16px;
				padding: 12px;
				background: #434343;
				border-radius: 4px;

				& > div {
					display: flex;
					align-items: flex-end;
					flex-basis: calc(50% - 16px);
					white-space: nowrap;
					flex-grow: 1;
				}
			}

			sui-input {
				background: rgba(255, 255, 255, 0.08);
				border: 1px solid rgba(255, 255, 255, 0.2);
				box-shadow: -1px -1px 1px rgba(0, 0, 0, 0.25), inset 1px 1px 1px rgba(0, 0, 0, 0.5);
				border-radius: 5px;

				&[type=checkbox] {
					filter: none;
					border-radius: 2px;
					border-width: 2px;
					border-color: rgba(255, 255, 255, 1);
					vertical-align: baseline;

					&[checked] {
						border: none;
						color: rgba(0, 0, 0, 0.5);
						background: rgba(255, 255, 255, 1);
						box-shadow: inset -1px -1px 2px rgba(0, 0, 0, 0.25);
					}
				}
			}

			sui-select {
				background: rgba(255, 255, 255, 0.08);
				border: 0.5px solid #8C8C8C;
				box-shadow: inset -1px -1px 2px rgba(0, 0, 0, 0.25), inset 1px 1px 2px rgba(255, 255, 255, 0.65);
				border-radius: 4px;
			}

			.line-input {
				background-color: transparent;
				color: #fff;
				border: none;
				border-radius: 0;
				border-bottom: 1px solid rgba(255, 255, 255, 0.6);
				width: 100%;
				margin-left: 8px;
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