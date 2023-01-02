<template lang="pug">
.verticalPadding
    h1 Record
    span This is some text

// search form
form
    // mask clicker for closing advanced search
    .mask(v-if='searchForm.isAdvanced' @click='searchForm.isAdvanced = false')
    .select-input(style='width: 400px;margin: 8px 0;' @click.stop)
        // main search
        .select-field
            sui-select(
                name='search_type'
                :value="searchForm.type"
                @input="e => {searchForm.type = e.target.value; if(e.target.value === 'record') searchForm.isAdvanced = false;}")
                option(value="table" selected) Table Name
                option(value="user") User ID
                option(value="record") Record ID

        .input-field
            span.material-symbols-outlined.placeholder-icon(v-if="!searchForm.value") search
            sui-input(
                type="search"
                :name="searchForm.type === 'table' ? 'table' : searchForm.type === 'user' ? 'reference' : 'record_id'"
                placeholder="Search"
                :required='searchForm.isAdvanced ? "true" : null'
                :value="searchForm.value"
                @input="e=>searchForm.value = e.target.value"
                @change="e=>{ if(!searchForm.isAdvanced) advancedForm = advancedFormInit(); }"
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
                        name='table'
                        placeholder="Table Name"
                        :value="advancedForm.table || ''"
                        @input="e => advancedForm.reference = e.target.value")

                .formLabel Subscription Table
                .form
                    .iconText(style='vertical-align: middle;width: 100%;display:inline-block;')
                        // subscription
                        .labelRadio.clickable
                            label.iconText(for='subscription-none') None
                            sui-input#subscription-none(type='radio' name='subscription' @change='e=>{advancedForm.subscription = null; parseIndexType()}' :checked="(advancedForm.subscription === null) ? true : null")

                        .labelRadio.clickable
                            label.iconText(for='subscription-public') Public
                            sui-input#subscription-public(type='radio' name='subscription' @change='e=>{advancedForm.subscription = true; parseIndexType()}' :checked="(advancedForm.subscription === true) ? true : null")

                        .labelRadio.clickable
                            label.iconText(for='subscription-sub') Subscribed
                            sui-input#subscription-sub(type='radio' name='subscription' @change='e=>{advancedForm.subscription = false; parseIndexType()}' :checked="(advancedForm.subscription === false) ? false : null")

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
                            ref='indexValueEl'
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

sui-button(style='float:right;margin: 8px 0;') + Add Record

.record-container
    .header.label
        span.not-clickable Table name
        div.not-clickable
            span Size
            span # of records
        span.material-symbols-outlined.clickable(:class="{'animation-rotation': fetchingTables}" @click="()=>{if(!fetchingTables) search(route.query, true)}") cached

    template(v-if='recordTables !== null')
        .noTables(v-if='!recordTables.list.length')
            div
                sui-flextext(min-size='16' max-size='32') No Records
                br
                p List of tables will show when there is data

        template(v-else)
            .tableWrapper(v-for="t in visibleTables[currentSelectedTablePage]")
                .list.label.clickable(@click="()=>t.opened = !t.opened")
                    span {{ t.table }}
                    div
                        span {{getSize(t.size)}}
                        span {{t.number_of_records}}

                    template(v-if='t.records')
                        span.material-symbols-outlined.clickable(v-if="!t.opened") add_circle
                        span.material-symbols-outlined.clickable(v-else) remove_circle

                    span.material-symbols-outlined.animation-rotation(v-else) cached

                template(v-if="t.opened && t.records")
                    .noRecords(v-if='!visibleTables[currentSelectedTableBatch].length')
                        div
                            sui-flextext(min-size='14' max-size='24') No Records
                            br
                            p This table will be automatically removed.

                    .records.clickable(v-else v-for="r in t.records.list")
                        div
                            span.label RECORD: 
                            span {{ r.record_id }}
                        div
                            span.label UPLOADED: 
                            span {{ dateFormat(r.uploaded) }}
                        div
                            span.label USER: 
                            span {{ r.user_id }}

                    .loadMore(v-if="!t.records.endOfList")
                        span.material-symbols-outlined.animation-rotation cached

            .paginator
                span.material-symbols-outlined.arrow(style="transform: rotate(180deg)" :class="{active: currentSelectedTableBatch}") arrow_forward_ios
                span.morePage(:class="{active: currentSelectedTableBatch}") ...

                span.page(
                    v-for="(i, idx) in numberOfPagePerBatch - (numberOfPagePerBatch % visibleTables[currentSelectedTableBatch].length)"
                    :class="{active: currentSelectedTableBatch * numberOfTablePerPage + idx === currentSelectedTablePage}"
                    @click="currentSelectedTablePage = currentSelectedTableBatch * numberOfTablePerPage + idx") {{ currentSelectedTableBatch * numberOfTablePerPage + i }}

                span.morePage(:class="{active: !recordTables.endOfList && currentSelectedTableBatch < visibleTables.length - 1 }" @click="fetchMoreTables") ...
                span.material-symbols-outlined.arrow(:class="{active: !recordTables.endOfList && currentSelectedTableBatch < visibleTables.length - 1 }" @click="fetchMoreTables") arrow_forward_ios

pre {{ searchResult || recordTables }}
</template>
<!-- script below -->
<script setup>
import { inject, reactive, ref, watch, computed } from 'vue';
import { skapi, getSize, dateFormat } from '@/main';
import { useRoute, useRouter } from 'vue-router';
let route = useRoute();
let router = useRouter();

let serviceId = route.params.service;

let pageTitle = inject('pageTitle');
pageTitle.value = 'Records';

////////////////////////////////////////////////////////////////////
// search part

let searchForm = reactive({
    type: 'table',
    value: '',
    isAdvanced: false
});

let indexValueEl = ref(null);

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
    }[advancedForm.value.index_type](value || indexValueEl.value.el.value);

    return advancedForm.value.index_value;
}

let recordTables = inject('recordTables');
let searchResult = ref(null);
let fetchingTables = ref(false);

let numberOfTablePerFetch = 8;
let numberOfTablePerPage = 2;
let numberOfPagePerBatch = numberOfTablePerFetch / numberOfTablePerPage;
let currentSelectedTablePage = ref(0);
let currentSelectedTableBatch = ref(0);

let visibleTables = computed(() => {

    if (!recordTables.value) {
        currentSelectedTableBatch.value = 0;
        return null;
    }

    const outputArray = [];

    for (let i = 0; i < recordTables.value.list.length; i += numberOfTablePerPage) {
        outputArray.push(recordTables.value.list.slice(i, i + numberOfTablePerPage));
    }

    if (!outputArray.length) {
        currentSelectedTableBatch.value = 0;
    }
    else if (outputArray.length - 1 < currentSelectedTableBatch.value) {
        currentSelectedTableBatch.value = outputArray.length - 1;
    }

    console.log({ outputArray });

    let currPage = currentSelectedTablePage.value;
    let currBatch = parseInt((currPage * numberOfTablePerPage) / numberOfTablePerFetch);

    console.log({ currBatch, currPage, numberOfPagePerBatch, numberOfTablePerPage });

    currentSelectedTableBatch.value = currBatch;

    return outputArray;
});


async function fetchMoreTables() {
    fetchingTables.value = true;


    let t = await skapi.getTable({ service: serviceId }, { limit: numberOfTablePerFetch }).catch(err => {
        fetchingTables.value = false;
        throw err;
    });

    recordTables.value.endOfList = t.endOfList;

    t.list.map(m => {
        m.opened = false;
        m.records = ref(null);

        skapi.getRecords({
            service: serviceId,
            table: m.table
        }, { refresh: true }).then(r => m.records.value = r);

        recordTables.value.list.push(m);
    });
    
    currentSelectedTablePage.value = currentSelectedTableBatch.value * numberOfTablePerFetch;

    fetchingTables.value = false;
}

function search(searchParams, refresh = false) {
    // search query

    if (!Object.keys(searchParams).length) {
        ////////////////////////////////////////////////////////////////////
        // fetch table list
        searchResult.value = null;

        if (!refresh && recordTables.value) {
            return;
        }

        recordTables.value = null;
        fetchingTables.value = true;

        skapi.getTable({ service: serviceId }, { refresh: true, limit: numberOfTablePerFetch })
            .then(t => {

                recordTables.value = {
                    endOfList: t.endOfList,
                    list: t.list.map(m => {
                        m.opened = false;
                        m.records = ref(null);

                        skapi.getRecords({
                            service: serviceId,
                            table: m.table
                        }, { refresh: true }).then(r => m.records.value = r);

                        return m;
                    })
                };

                fetchingTables.value = false;
            }).catch(err => {
                fetchingTables.value = false;
                throw err;
            });

        return;
    }

    ////////////////////////////////////////////////////////////////////
    // fetch search
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
                console.log({ value });
                searchForm.type = value;
                break;

            case 'access_group':
                advancedForm.value[k] = value;
                params.access_group = value === 'private' ? 'private' : Number(value);
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
                }
                else {
                    advancedForm.value[k] = value;
                }
                params[k] = value;
        }
    }

    skapi.getRecords(params, { refresh: true })
        .then(r => {
            searchResult.value = r.list;
        });
}

watch(() => route.query, n => {
    if (route.name === 'records') {
        // route also triggers when getting out of the page
        search(n, true);
    }
});

search(route.query);

</script>

<style lang="less" scoped>
.verticalPadding {
    padding: 50px 0;
}

sui-input {
    input::placeholder {
        color: rgba(255, 255, 255, .6);
    }
}

form {
    z-index: 1;
    display: inline-block;
    max-width: 100%;
}

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

.record-container {
    clear: both;
    background-color: #434343;
    position: relative;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: -1px -1px 1px rgba(0, 0, 0, 0.25), inset 1px 1px 1px rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    margin: 0;
    margin-top: 36px;
    padding: 24px 20px;

    .material-symbols-outlined {
        color: white;
    }

    .header {
        padding: 0 16px;
        color: rgba(255, 255, 255, 0.4);
        display: flex;
        align-items: center;
        flex-wrap: wrap;
    }

    .tableWrapper {
        background-color: #262626;
        border-radius: 8px;
    }

    .records {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        font-size: 14px;
        padding: 16px 20px;

        &:nth-child(odd) {
            background-color: rgba(255, 255, 255, 0.04);
        }

        &:last-child {
            border-radius: 0 0 8px 8px;
        }

        &:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        div {
            &:not(:last-child) {
                margin-right: .75em;
            }

            span {
                font-family: monospace;

                &.label {
                    color: rgba(255, 255, 255, 0.6);
                }
            }

            &.loadMore {
                text-align: center;
                padding: 8px;
            }
        }
    }

    .label {
        &>span:not(.material-symbols-outlined) {
            display: inline-block;
            text-align: left;
            max-width: 50%;
            flex-grow: 1;
            padding-right: 1em;
        }

        &>div {
            position: relative;
            min-width: calc(50% - 24px);

            &>span {
                display: inline-block;
                width: 50%;
                white-space: nowrap;
                padding-right: 1em;
            }
        }
    }

    .list {
        background: #656565;
        border-radius: 4px;
        padding: 12px 16px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 16px;
    }

    .noRecords {
        padding: 16px 0;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: .6;
        flex-wrap: wrap;

        p {
            font-size: 14px;
            margin: 0;
        }
    }

    .noTables {
        margin: 32px 0;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: .6;
        flex-wrap: wrap;

        p {
            margin: 0;
        }
    }

    .paginator {
        margin-top: 24px;
        text-align: center;
        color: rgba(255 255 255 / 60%);
        user-select: none;

        &>span {
            padding: 4px 8px;
            width: 24px;
            box-sizing: content-box;


            &.page {
                cursor: pointer;

                &.active {
                    cursor: default;
                    color: #fff;
                    font-weight: bold;
                }
            }

            &.morePage {
                visibility: hidden;

                &.active {
                    cursor: pointer;
                    visibility: visible;
                }
            }

            &.arrow {
                color: rgba(255, 255, 255, .15);


                &.active {
                    cursor: pointer;
                    color: #fff;
                }
            }
        }
    }
}
</style>