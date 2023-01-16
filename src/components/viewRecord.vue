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
					template(v-if="props.record.config?.reference_limit === 0")
						.sub-grid Disabled
					template(v-else)
						.sub-grid Multiple Reference : {{props.record.config?.allow_multiple_reference ? 'Allowed' : 'Not Allowed'}}
						.sub-grid Reference Limit : {{ (typeof props.record.config?.reference_limit === 'number') ? props.record.config.reference_limit : 'Infinite' }}
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
				template(v-for="(record, key) in props.record.data")
					template(v-for="record in getDataByTypes(record)")
						template(v-if="record.files.length")
							.data-row
								.name
									span.type File
									span {{ key }}

								a.value.file(v-for="file in record.files" :href="file.url" style="text-decoration: none;color: unset;")
									span.material-symbols-outlined file_present
									span
										.filename {{ file.filename }}
										div(v-if="file.size" style="font-size: 12px;") {{ getSize(file.size) }}
									span.material-symbols-outlined download
							.data-row(v-for="data in record.json")
								.name
									span.type(v-if="typeof data === 'object'") JSON
									span.type(v-else) {{ typeof data }}
									span {{ key }}

								.value {{ data }}
						.data-row(v-else-if="record.json.length")
							.name
								span.type JSON
								span {{ key }}

							pre.value {{ record.json }}
						.data-row(v-else)
							.name
								span.type {{ typeof record.primitive }}
								span {{ key }}

							pre.value {{ record.primitive }}
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
									@input="(e)=>form.config.allow_multiple_reference = e.target.checked"
									:checked="form.config.allow_multiple_reference ? true : null")

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
				template(v-for="(keyData, keyIndex) in data")
					.data-row(v-for="(record, index) in keyData.data")
						.data-name-action
							.select-input
								.select-field
									sui-select(:value="record.type" @change="(e) => record.type = e.target.value")
										option(value="string") String
										option(value="number") Number
										option(value="boolean") Boolean
										option(value="file") File
										option(value="json") JSON
								.input-field
									sui-input(type="text" :value="keyData.key" @input="(e) => keyData.key = e.target.value" required)
							.action(@click="removeField(keyData, keyIndex, index)")
								span.material-symbols-outlined delete
								span.hideOnTablet remove
						.data-values 
							template(v-if="record.type === 'file'")
								.file-upload-area(@dragenter.stop.prevent="" @dragover.stop.prevent="" @drop.stop.prevent="onDrop($event, keyIndex, index)" @click="openFileInput($event)")
									input(style="display: none;" type="file" @change="addFiles($event, keyIndex, index)" multiple)
									div
										span.material-symbols-outlined(style="font-size: 57px") file_present
										span.hideOnTablet(style="margin-right: 6px;") Drag and Drop OR  
										sui-button.line-button(@click.prevent.stop="" type="button") Upload
								.value.file(v-for="(file, index) in record.data")
									span.material-symbols-outlined file_present
									span
										.filename {{ file.name || file.filename }}
										div(v-if="file.size" style="font-size: 12px;") {{ getSize(file.size) }}
									span.material-symbols-outlined(@click="record.data.splice(index, 1)") cancel

							.data-input-field(v-else-if="record.type === 'json'")
								sui-input(:value="record.data" @input="e => { record.data = e.target.value; e.target.setCustomValidity('')}" @change="validateJson")
							
							.data-input-field.transparent.boolean(v-else-if="record.type === 'boolean'")
								div Value:
								div
									label True
									sui-input(type="radio" :name="keyData.key" value="true" :checked="record.data === true ? true : null")
								div
									label False
									sui-input(type="radio" :name="keyData.key" value="false" :checked="record.data !== true ? true : null")

							.data-input-field(v-else-if="record.type === 'number'")
								sui-input(type='number' :name="keyData.key" :value="record.data")

							.data-input-field(v-else)
								sui-input(:name="keyData.key" :value="record.data")
				div
					sui-button.line-button(type="button" style="width: 100%;" @click.prevent="addField") Add Data

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
sui-overlay(ref="exitEditOverlay")
	.popup
		.title
			span.material-symbols-outlined error
			div Are you sure?
		.body Are you sure you want to close? You are still editing.
		.foot
			sui-button(@click="exitEditOverlay.close") No 
			sui-button.line-button(@click="confirmClose") Yes
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
const exitEditOverlay = ref(null);

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

	data.value = [];
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
		let recordData = record.data;
		for(let key in recordData) {
			let keyObj = {key, data:[]}
			let typeSplitFiles = getDataByTypes(recordData[key]).data;
			if(typeSplitFiles.files.length) {
				keyObj.data.push({type: 'file', data: typeSplitFiles.files});
				typeSplitFiles.json.forEach(value => {
					if(Array.isArray(value)) {
						keyObj.data.push({type: 'json', data:  JSON.stringify(value)});
					} else {
						keyObj.data.push({type: typeof value, data: value});
					}
				});
			} else {
				if(typeSplitFiles.primitive !== null) {
					keyObj.data.push({type: typeof typeSplitFiles.primitive, data: typeSplitFiles.primitive});
				} else {
					keyObj.data.push({type:'json', data: JSON.stringify(typeSplitFiles.json)});
				}
			}

			data.value.push(keyObj);
		}
	}

	isEdit.value = true;
};

const save = (e) => {
	Object.assign(form.value, {
		service: serviceId,
		formData: form => {
			data.value.forEach(record => {
				record.data.forEach(field => {
					if(field.type === 'json') {
						form.append(record.key, new Blob([field.data], {
							type: 'application/json'
						}));
					} else if(field.type === 'file') {
						field.data.forEach(file => {
							if(file instanceof File) {
								form.append(record.key, file);
							} else {
								form.append(record.key, new Blob([JSON.stringify(file)], {
									type: 'application/json'
								}));
							}
						});
					}
				})
			})
			return form;
		}

	});

	if (!form.value.index?.name) {
		form.value.index = null; // set to null to remove index
	}

	skapi.postRecord(Object.keys(data.value).length ? e.target : null, form.value).then(r => {
		for(let k in r) {
			props.record[k] = r[k];
		}
		isEdit.value = false;
	});
};

const onDrop = (event, keyIndex, index) => {
	const files = event.dataTransfer.files;
	let fileData = data.value[keyIndex].data[index].data;
	data.value[keyIndex].data[index].data = [...fileData, ...files];
}

const addFiles = (event, keyIndex, index) => {
	const files = event.target.files;
	let fileData = data.value[keyIndex].data[index].data;
	data.value[keyIndex].data[index].data = [...fileData, ...files];
	event.target.value = '';
}

const addField = () => {
	data.value.push({key: '', data: [{type: 'string', data: []}]});
}

const removeField = (keyData, keyIndex, index) => {
	keyData.data.splice(index, 1);
	if(!keyData.data.length) {
		data.value.splice(keyIndex, 1);
	}
}

const openFileInput = (event, index) => {
	const parent = event.target.closest('.file-upload-area');
	parent.querySelector('input[type="file"]').click();
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

const getDataByTypes = (record) => {
	let files = [];
	let json = [];
	let primitive = null;
	if(Array.isArray(record)) {
		for(let key in record) {
			if(record[key].md5) {
				files.push(record[key]);
			} else {
				json.push(record[key]);
			}
		}
	} else if(typeof record === 'object') {
		if(record?.md5) {
			files.push(record);
		} else {
			json.push(record);
		}
	} else {
		primitive = record;
	}
	
	return {data: {files, json, primitive}};
}

const confirmClose = () => {
	exitEditOverlay.value.close();
	isEdit.value = false;
	view.value = 'information';
	emit('close');
}

const close = () => {
	if(isEdit.value) {
		exitEditOverlay.value.open();
		return false;
	}
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
					padding: 0 20px;
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
						margin-right: 4px;
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