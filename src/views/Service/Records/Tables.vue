<template lang="pug">
.recordPageHead
    h1 Record
    span This is some text
    br
    sui-button(style="float:right;background-color:rgba(255 255 255 / 6%);color:white;box-shadow:none;border: 1px solid;") Read Doc
    div(style="clear:both;")

// search form
RecordSearch#recordSearch.hideOnTablet

sui-button.hideOnTablet(style='float:right;margin: 8px 0;') + Add Record
.hideOnTablet(style="clear:both;")

.table-container#data-container
    .header.labelHead
        span.not-clickable Table name
        div.not-clickable
            span Size
            span # of records
        span.material-symbols-outlined.clickable.hideOnTablet(:class="{'animation-rotation': fetchingData}" @click="()=>{ if(!fetchingData) getTables(true); }") cached

    // skeleton(mobile)
    .tableHead.animation-skeleton.showOnTablet(v-if='recordTables === null' v-for="t in numberOfSkeletons()")
        span &nbsp;

    // table list
    template(v-else)
        .noTables(v-if='!recordTables.list.length')
            div
                sui-flextext(min-size='16' max-size='32') No Record Tables
                br
                p List of tables will show when there is data

        template(v-else-if="groupedTableList && groupedTableList[currentSelectedTableBatch]")
            template(v-for="batchIdx in (viewport === 'desktop' ? [currentSelectedTableBatch + 1] : groupedTableList.length)")
                template(v-for="pageIdx in (viewport === 'desktop' ? [currentSelectedTablePage + 1] : groupedTableList[batchIdx - 1].length)")
                    // when v-for by number, it starts with 1
                    .tableWrapper(v-for="t in groupedTableList[batchIdx - 1][pageIdx - 1]")
                        .tableHead.labelHead.clickable(@click='()=>{viewRecordList(t)}')
                            span {{ t.table }}
                            div
                                span {{getSize(t.size)}}
                                span {{t.number_of_records}}

                            template(v-if='t.records')
                                span.material-symbols-outlined.clickable(v-if="!t.opened") add_circle
                                span.material-symbols-outlined.clickable(v-else) remove_circle

                            span.material-symbols-outlined.animation-rotation(v-else) cached

                        div(v-if="t.opened && t.records" style="max-height: 60vh;overflow-y: auto;" @scroll="(e)=>getMoreRecords(e, t)")
                            .noRecords(v-if='!t.records.list.length')
                                div
                                    sui-flextext(min-size='14' max-size='24') No Records
                                    br
                                    p This table will be automatically removed.

                            .records(v-else v-for="r in t.records.list" style="cursor:pointer;")
                                div
                                    span.labelHead RECORD: 
                                    span {{ r.record_id }}
                                div
                                    span.labelHead UPLOADED: 
                                    span {{ dateFormat(r.uploaded) }}
                                div
                                    span.labelHead USER: 
                                    span {{ r.user_id }}

                            .loadMore(v-if="!t.records.endOfList")
                                span.material-symbols-outlined.animation-rotation cached

                .paginator.hideOnTablet
                    span.material-symbols-outlined.arrow(
                        style="transform: rotate(180deg)"
                        :class="{active: currentSelectedTableBatch || currentSelectedTablePage}"
                        @click="()=>{ if(currentSelectedTablePage) currentSelectedTablePage--; else { currentSelectedTablePage = numberOfPagePerBatch - 1; currentSelectedTableBatch--; } }") arrow_forward_ios
                    span.morePage(
                        :class="{active: currentSelectedTableBatch}"
                        @click="()=>{ if(currentSelectedTableBatch > 0) {currentSelectedTableBatch--; currentSelectedTablePage = numberOfPagePerBatch - 1} }") ...

                    span.page(
                        v-for="(i, idx) in groupedTableList[currentSelectedTableBatch].length"
                        :class="{active: idx === currentSelectedTablePage}"
                        @click="()=>currentSelectedTablePage = idx") {{ currentSelectedTableBatch * numberOfPagePerBatch + i }}

                    span.morePage(
                        :class="{active: !recordTables.endOfList || groupedTableList.length - 1 > currentSelectedTableBatch }"
                        @click="getMoreTables") ...
                    span.material-symbols-outlined.arrow(
                        :class="{active: currentSelectedTablePage < groupedTableList[currentSelectedTableBatch].length - 1 || !recordTables.endOfList && currentSelectedTablePage === groupedTableList[currentSelectedTableBatch].length - 1 }"
                        @click="()=>{ if(currentSelectedTablePage < groupedTableList[currentSelectedTableBatch].length - 1 ) currentSelectedTablePage++; else if(!recordTables.endOfList && currentSelectedTablePage === groupedTableList[currentSelectedTableBatch].length - 1) getMoreTables() }") arrow_forward_ios

.page-action.showOnTablet
    sui-button.fab.open-menu(@click="isFabOpen = !isFabOpen" @blur="isFabOpen = false")
        span.material-symbols-outlined more_vert
    Transition
        div(v-if="isFabOpen")
            sui-button.fab(@click="router.push({name: 'mobileSearch'})")
                span.material-symbols-outlined search
            sui-button.fab
                span.material-symbols-outlined add
</template>
<!-- script below -->
<script setup>
import { inject, ref, watch, computed, nextTick } from 'vue';
import { skapi, getSize, dateFormat, groupArray } from '@/main';
import { useRoute, useRouter } from 'vue-router';
import RecordSearch from '@/components/recordSearch.vue';
let route = useRoute();
let router = useRouter();
let serviceId = route.params.service;

let pageTitle = inject('pageTitle');
pageTitle.value = 'Records';

// flag
let fetchingData = inject('fetchingData');
let isFabOpen = ref(false);

// data
let recordTables = inject('recordTables');
let searchResult = inject('searchResult');

// for paginators
let fetchLimit = 50;
let numberOfTablePerPage = 10;
let numberOfPagePerBatch = fetchLimit / numberOfTablePerPage;

let currentSelectedTablePage = ref(0);
let currentSelectedTableBatch = ref(0);

let groupedTableList = computed(() => {
    if (!recordTables.value || !recordTables.value.list.length) {
        currentSelectedTableBatch.value = 0;
        return null;
    }

    return groupArray(recordTables.value.list, numberOfTablePerPage, numberOfPagePerBatch);
});

if (groupedTableList.value) {
    for (let t of groupedTableList.value[0][0]) {
        // close all opened
        t.opened = false;
    }
}

let getMoreTablesQueue = null;
async function getMoreTables() {
    if (recordTables.value.endOfList && groupedTableList.value.length - 1 === currentSelectedTableBatch.value) {
        return;
    }

    fetchingData.value = true;

    if (groupedTableList.value.length - 1 > currentSelectedTableBatch.value) {
        currentSelectedTableBatch.value += 1;
        currentSelectedTablePage.value = 0;
        fetchingData.value = false;
        return;
    }

    if (getMoreTablesQueue instanceof Promise) {
        return;
    }

    getMoreTablesQueue = skapi.getTable({ service: serviceId }, { limit: fetchLimit }).catch(err => {
        fetchingData.value = false;
        throw err;
    });

    let t = await getMoreTablesQueue;
    recordTables.value.endOfList = t.endOfList;

    t.list.map(m => {
        m.opened = false;
        m.records = ref(null);

        skapi.getRecords({
            service: serviceId,
            table: m.table
        }, { refresh: true, limit: fetchLimit }).then(r => m.records.value = r);

        recordTables.value.list.push(m);
    });

    currentSelectedTableBatch.value += 1;
    currentSelectedTablePage.value = 0;

    fetchingData.value = false;
}

function getTables(refresh = false) {
    // initial table fetch

    currentSelectedTablePage.value = 0;
    currentSelectedTableBatch.value = 0;

    if (!refresh && recordTables.value) {
        // bypass if already fetched || is a search query
        fetchingData.value = false;
        return;
    }

    recordTables.value = null;
    fetchingData.value = true;

    skapi.getTable({ service: serviceId }, { refresh: true, limit: fetchLimit })
        .then(t => {
            recordTables.value = {
                endOfList: t.endOfList,
                list: t.list.map(m => {
                    m.opened = false;
                    m.records = ref(null);

                    skapi.getRecords({
                        service: serviceId,
                        table: m.table
                    }, { refresh: true, limit: 50 }).then(r => m.records.value = r);

                    return m;
                }),
                params: {
                    service: serviceId,
                    table: t.table
                }
            };

            fetchingData.value = false;
        }).catch(err => {
            fetchingData.value = false;
            throw err;
        });

    return;
}

// get tables on created
getTables();

// fetch table records
let getMoreRecordsQueue = {};
async function getMoreRecords(event, table) {
    if (event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight - 40) {
        if (getMoreRecordsQueue?.[table.table] instanceof Promise) {
            return;
        }

        getMoreRecordsQueue[table.table] = await skapi.getRecords({
            service: serviceId,
            table: table.table
        }, { refresh: false, limit: fetchLimit });

        let r = getMoreRecordsQueue[table.table];
        for (let rec of r.list) {
            table.records.list.push(rec);
        }

        table.records.endOfList = r.endOfList;
        delete getMoreRecordsQueue[table.table];
    }
}

function numberOfSkeletons() {
    // calculated by available vertical space
    return parseInt((window.innerHeight / 2) / 48);
}

let viewport = inject('viewport');
function viewRecordList(t) {
    if (viewport.value === 'mobile') {
        searchResult.value = t.records;
        router.push(`/dashboard/${serviceId}/records/list?search_type=table&table=${t.table}`);
    }
    else {
        t.opened = !t.opened;
    }
}

// watchers
let appStyle = inject('appStyle');
function adjustBackgroundColor(n) {
    // record page has darker background in mobile mode
    appStyle.background = n === 'mobile' ? 'rgb(67, 67, 67)' : '#595959';
}

adjustBackgroundColor(viewport.value);
watch(viewport, n => {
    // close opened table on viewport change
    for (let t of groupedTableList.value[currentSelectedTableBatch.value][currentSelectedTablePage.value]) {
        t.opened = false;
    }
    adjustBackgroundColor(n);
});

watch(currentSelectedTablePage, n => {
    // close opened table on page change
    for (let t of groupedTableList.value[currentSelectedTableBatch.value][n]) {
        t.opened = false;
    }
    nextTick(() => {
        window.document.getElementById('data-container').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
});
watch(currentSelectedTableBatch, n => {
    // close opened table on batch change
    for (let t of groupedTableList.value[n][currentSelectedTablePage.value]) {
        t.opened = false;
    }
    nextTick(() => {
        window.document.getElementById('data-container').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
});

</script>

<style lang="less" scoped>
@import '@/assets/variables.less';

.page-action {
    position: fixed;
    bottom: 76px;
    right: 16px;
    overflow: hidden;

    &>sui-button {
        z-index: 2;
    }

    &,
    &>div {
        display: flex;
        flex-direction: column-reverse;
        align-items: center;
        gap: 12px;
        width: 48px;
    }

    .v-enter-active,
    .v-leave-active {
        transition: opacity .1s ease, transform .1s ease;
        opacity: 1;
    }

    .v-enter-from,
    .v-leave-to {
        opacity: 0;
        transform: translateY(100px);
    }
}

.recordPageHead {
    padding: 50px 0;

    @media @tablet {
        padding: 24px 0;
    }
}

#recordSearch {
    z-index: 1;
    display: inline-block;
    position: relative;
    max-width: 100%;
}

.table-container {
    sui-input {
        input::placeholder {
            color: rgba(255, 255, 255, .6);
        }
    }

    background-color: #434343;
    position: relative;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: -1px -1px 1px rgba(0, 0, 0, 0.25),
    inset 1px 1px 1px rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    margin: 0;
    margin-top: 36px;
    padding: 24px 20px;

    @media @tablet {
        box-shadow: none;
        padding: 0;
        background-color: transparent;
        border: none;
    }

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

                    &.labelHead {
                        color: rgba(255, 255, 255, 0.6);
                    }
                }
            }
        }

        .loadMore {
            text-align: center;
            padding: 8px;
        }
    }


    .labelHead {
        &>span:not(.material-symbols-outlined) {
            display: inline-block;
            text-align: left;
            max-width: 50%;
            flex-grow: 1;
            padding-right: 1em;
            display: inline-block;
            text-overflow: ellipsis;
            overflow: hidden;

            @media @tablet {
                padding-right: 0.5em;
            }
        }

        &>div {
            position: relative;
            min-width: calc(50% - 24px);

            &>span {
                display: inline-block;
                width: 50%;
                white-space: nowrap;
                padding-right: 1em;

                @media @tablet {
                    padding-right: 0.5em;
                }
            }
        }
    }

    .tableHead {
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

        &>div {
            display: inline-block;
        }

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

            &.arrow {
                color: rgba(255, 255, 255, .15);

                &.active {
                    cursor: pointer;
                    color: #fff;
                }
            }

            &.morePage {
                visibility: hidden;

                &.active {
                    cursor: pointer;
                    visibility: visible;
                }
            }
        }
    }
}
</style>