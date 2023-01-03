<template lang="pug">
// search form
form(
    :action="'/dashboard/' + serviceId + '/records/search'"
    @submit.prevent="submitSearch")
    // mask clicker for closing advanced search
    .mask(v-if='searchForm.isAdvanced' @click='searchForm.isAdvanced = false')
    .select-input(style='width: 400px;margin: 8px 0;' @click.stop)
        // main search
        .select-field
            sui-select(
                name='search_type'
                :value="searchForm.type"
                @input="e => {searchForm.type = e.target.value; if(e.target.value === 'record') searchForm.isAdvanced = false; }")
                option(value="table" selected) Table Name
                option(value="user") User ID
                option(value="record") Record ID

        .input-field
            span.material-symbols-outlined.placeholder-icon(v-if="!searchForm.value") search
            sui-input(
                type="search"
                :name="searchForm.type === 'table' ? 'table' : searchForm.type === 'user' ? 'reference' : 'record_id'"
                :placeholder="searchForm.type === 'table' ? 'Table name' : searchForm.type === 'user' ? 'User id' : 'Record id'"
                :required='searchForm.isAdvanced ? "true" : null'
                :value="searchForm.value"
                @input="e=>{ searchForm.value = e.target.value; }"
                @change="e => { if(!searchForm.isAdvanced) advancedForm = advancedFormInit(); }"
                autocomplete="off")
            span.material-symbols-outlined.clickable.optionButton(v-if='searchForm.type !== "record"' @click="searchForm.type === 'record' ? searchForm.isAdvanced = false : searchForm.isAdvanced = !searchForm.isAdvanced") tune

        // advanced search
        .floatBox(v-if='searchForm.isAdvanced && searchForm.type !== "record"')
            .formLabel Access Group
            .form
                .labelRadio.clickable
                    label.iconText(for='ag-reg') Registered
                    sui-input#ag-reg(type='radio' value='1' name='access_group' @change='advancedForm.access_group = 1' :checked='advancedForm.access_group === 1 ? true : null')

                .labelRadio.clickable
                    label.iconText(for='ag-pub') Public
                    sui-input#ag-pub(type='radio' value='0' name='access_group' @change='advancedForm.access_group = 0' :checked='advancedForm.access_group === 0 ? true : null')

                .labelRadio.clickable
                    label.iconText(for='ag-prv') Private
                    sui-input#ag-prv(type='radio' value='private' name='access_group' @change='advancedForm.access_group = "private"' :checked='advancedForm.access_group === "private" ? true : null')

            template(v-if='searchForm.type === "user"')
                .formLabel Table Name
                .form
                    // table
                    sui-input(
                        style='width:100%'
                        required
                        name='table'
                        placeholder="Table Name"
                        :value="advancedForm.table || ''"
                        @input="e => advancedForm.reference = e.target.value")

                .formLabel Table Subscription
                .form
                    .iconText(style='vertical-align: middle;width: 100%;display:inline-block;')
                        // subscription
                        .labelRadio.clickable
                            label.iconText(for='subscription-none') None
                            sui-input#subscription-none(type='radio' name='subscription' value='null' @change='e=>{advancedForm.subscription = null; parseIndexType()}' :checked="advancedForm.subscription === null || null")

                        .labelRadio.clickable
                            label.iconText(for='subscription-public') Public
                            sui-input#subscription-public(type='radio' name='subscription' value='false' @change='e=>{advancedForm.subscription = false; parseIndexType()}' :checked="advancedForm.subscription === false || null")

                        .labelRadio.clickable
                            label.iconText(for='subscription-sub') Subscribed
                            sui-input#subscription-sub(type='radio' name='subscription' value='true' @change='e=>{advancedForm.subscription = true; parseIndexType()}' :checked="advancedForm.subscription === true || null")

            .formLabel Index
            .form
                // index name
                sui-input(
                    style='width:100%'
                    name="index_name"
                    placeholder="Index Name"
                    :required="advancedForm.index_value !== undefined || null"
                    :value="advancedForm.index_name"
                    @input="e => advancedForm.index_name = e.target.value")

                br
                br

                // index data type
                sui-select(
                    name="index_type"
                    style="vertical-align: middle; width: 100px; margin-right:1em;"
                    :value='advancedForm.index_type'
                    @change="e=>{ advancedForm.index_type = e.target.value; parseIndexType(); }")
                    option(disabled) Value type
                    option(value="string" selected) String
                    option(value="number") Number
                    option(value="boolean") Boolean

                .iconText(v-if='advancedForm.index_type === "boolean"' style='vertical-align: middle;width: calc(100% - 100px - 1em);display:inline-block;')
                    // index value (boolean)
                    .labelRadio.clickable
                        label.iconText(for='typ-bool-false') False
                        sui-input#typ-bool-false(type='radio' name='index_value' @change='e=>{advancedForm.index_value = false; parseIndexType()}' :checked="(advancedForm.index_value === false) ? true : null")

                    .labelRadio.clickable
                        label.iconText(for='typ-bool-true') True
                        sui-input#typ-bool-true(type='radio' name='index_value' @change='e=>{advancedForm.index_value = true; parseIndexType()}' :checked="(advancedForm.index_value === true) ? true : null")

                .select-input(v-else style='width: calc(100% - 100px - 1em);')
                    // index value
                    .input-field
                        sui-input(
                            autocomplete="off"
                            ref='indexValueFormElement'
                            name="index_value"
                            :type="advancedForm.index_type === 'number' ? 'number' : 'text'"
                            placeholder="Index value"
                            :required="advancedForm.index_name !== undefined || null"
                            :value='advancedForm.index_value === undefined || (typeof advancedForm.index_value === "boolean") ? "" : advancedForm.index_value.toString()'
                            @input="()=>parseIndexType()")

                    .select-field(style='overflow:hidden;')
                        // index value condition
                        sui-select(
                            style='width:60px'
                            name="index_condition"
                            :value="advancedForm.index_condition"
                            @change="e => advancedForm.index_condition = e.target.value")
                            option(disabled) Condition
                            option(value=">=") &gt;=
                            option(value=">") &gt;
                            option(value="=" selected) =
                            option(value="<") &lt;
                            option(value="<=") &lt;=

            .formLabel Tag
            .form
                // Tag
                sui-input(
                    style='width:100%'
                    name='tag'
                    placeholder="Tag Name"
                    :value="advancedForm.tag || ''"
                    @input="e => advancedForm.tag = e.target.value")

            template(v-if='searchForm.type === "table"')
                .formLabel Reference ID
                .form
                    // Reference
                    sui-input(
                        style='width:100%'
                        name='reference'
                        placeholder="Referenced Record ID"
                        :value="advancedForm.reference || ''"
                        @input="e => advancedForm.reference = e.target.value")

            div(style='text-align:center;')
                sui-input.line-button(style='margin: 8px .5em; width: 6em;' type='reset' @click.prevent="advancedForm = advancedFormInit()") Reset
                sui-input(style='margin: 8px .5em;width: 6em;' type='submit') Search

</template>
<!-- script below -->
<script setup>
import { inject, reactive, ref, watch } from 'vue';
import { skapi } from '@/main';
import { useRoute, useRouter } from 'vue-router';
let route = useRoute();
let router = useRouter();
let serviceId = route.params.service;
// let pageTitle = inject('pageTitle');
// pageTitle.value = 'Records';

function submitSearch(ev) {
    // using vue route instead of vanila get request to prevent browser refresh
    let data = new FormData(ev.currentTarget);
    let queryParts = [];
    let entries = data.entries();
    for (let pair of entries) {
        queryParts.push(encodeURIComponent(pair[0]) + "=" + encodeURIComponent(pair[1]));
    }
    let query = queryParts.join("&");
    let url = `/dashboard/${serviceId}/records/search?${query}`;
    router.push(url);
    searchForm.isAdvanced = false;
}

////////////////////////////////////////////////////////////////////
// search part
let searchForm = reactive({
    type: 'table',
    value: '',
    isAdvanced: false
});

let indexValueFormElement = ref(null);

function advancedFormInit() {
    // return fresh object
    return {
        access_group: 1,
        table: undefined,
        subscription: null,
        index_type: 'string',
        index_name: undefined,
        index_name: undefined,
        index_value: undefined,
        index_condition: '=',
        tag: undefined,
        reference: undefined
    };
}

let advancedForm = ref(advancedFormInit());

function parseIndexType(value) {
    advancedForm.value.index_value = {
        'string': v => v ? v.toString() : undefined,
        'boolean': v => {
            advancedForm.value.index_condition = '=';
            // value is already set from radio, else set to false if not boolean
            return (typeof advancedForm.value.index_value === 'boolean') ? advancedForm.value.index_value : false;
        },
        'number': v => v === '' ? undefined : isNaN(Number(v)) ? 0 : Number(v)
    }[advancedForm.value.index_type](value || indexValueFormElement.value.el.value);

    return advancedForm.value.index_value;
}

// flag
let fetchingData = inject('fetchingData');

// data
let searchResult = inject('searchResult');

function search(searchParams, refresh = false) {
    // search query
    let params = {
        service: serviceId
    };

    let type = searchParams['search_type'];
    if (!searchParams[type === 'table' ? 'table' : type === 'user' ? 'reference' : 'record_id']) {
        return router.replace('records');
    }

    for (let k in searchParams) {
        // ignore empty values
        if (!searchParams[k]) {
            continue;
        }

        let value = searchParams[k];
        switch (k) {
            case 'search_type':
                searchForm.type = value;
                break;

            case 'access_group':
                let access_group = value === 'private' ? 'private' : Number(value);
                params.access_group = access_group;
                advancedForm.value[k] = access_group;
                break;

            case 'index_name':
                if (!params?.index) {
                    params.index = {};
                };
                advancedForm.value[k] = value;
                params.index.name = value;
                break;

            case 'index_type':
                if (searchParams.index_value) {
                    advancedForm.value.index_type = searchParams.index_type;
                }
                break;

            case 'index_value':
                if (!params?.index) {
                    params.index = {};
                };
                params.index.value = parseIndexType(value);
                break;

            case 'index_condition':
                if (!searchParams.index_name) {
                    break;
                }
                if (!params?.index) {
                    params.index = {};
                }
                advancedForm.value[k] = value;
                params.index.condition = value;
                break;

            default:
                let main_search = searchForm.type === 'table' ? 'table' : searchForm.type === 'user' ? 'reference' : 'record_id';
                if (k === main_search) {
                    searchForm.value = value;
                    if (searchForm.type === 'user') {
                        if (searchParams?.subscription) {
                            let val = JSON.parse(searchParams?.subscription);
                            advancedForm.value.subscription = val;
                            if (val === null) {
                                params[k] = value;
                            }
                            else {
                                params.subscription = {
                                    user_id: value,
                                    group: val ? 1 : 0
                                };
                            }
                        }
                    }
                    else {
                        params[k] = value;
                    }
                }
                else if (k !== 'subscription') {
                    advancedForm.value[k] = value;
                    params[k] = value;
                }
        }
    }

    fetchingData.value = true;

    skapi.getRecords(params, { refresh: true, limit: 50 })
        .then(r => {
            searchResult.value = r;
            searchResult.value.params = params;
            console.log({ searchResult: searchResult.value });
            fetchingData.value = false;
        }).catch(err => {
            fetchingData.value = false;
            searchResult.value = {
                endOfList: true,
                list: []
            };
            throw err;
        });
}

watch(() => route.query, n => {
    if (route.name === 'recordSearch') {
        // prevent route triggering when getting out of the page
        search(n, true);
    }
    else if (route.name === 'records') {
        advancedForm.value = advancedFormInit();
        searchForm.value = '';
    }
});

if (route.name === 'recordSearch') {
    search(route.query);
}
</script>

<style lang="less" scoped>
form {
    sui-input {
        input::placeholder {
            color: rgba(255, 255, 255, .6);
        }
    }

    z-index: 1;
    display: inline-block;
    position: relative;
    max-width: 100%;

    .floatBox {
        position: absolute;
        margin-top: 8px;
        border-radius: 5px;
        width: 100%;
        border: 1px solid #808080;
        padding: 24px 20px;
        box-shadow: 4px 4px 12px rgba(0 0 0 / 25%);
        background-color: #333;
        top: 100%;

        .formLabel {
            font-weight: 700;
        }

        .form,
        .formLabel {
            margin: 8px 0;
        }

        .form {
            margin-bottom: 32px;

            &>sui-input:not([type='radio']) {
                background-color: rgba(255, 255, 255, 0.08);
            }
        }

        .labelRadio {
            display: inline-flex;
            align-items: center;
            opacity: 0.6;

            &:not(:last-child) {
                margin-right: 1.5em;
                margin-bottom: 4px;
            }

            &>* {
                vertical-align: middle;
            }

            &>label {
                padding-right: 0.5em;
            }

            &>sui-input[type="radio"] {
                color: inherit;
            }
        }
    }
}
</style>