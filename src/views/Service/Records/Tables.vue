<template lang="pug">
.page-header.head-space-helper
    h1 Record
    p Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse porta sed metus eget auctor. Nulla quis nulla a lorem consequat gravida viverra ac nisi. Donec rutrum mauris orci. Sed a velit sed magna aliquet gravida rutrum et magna.
    .action
        sui-button.line-button Read Doc

// search form
RecordSearch#recordSearch.hideOnTablet

sui-button.hideOnTablet(style='float:right;margin: 8px 0;' @click='()=>addRecord()') + Add Record
.hideOnTablet(style="clear:both;")

// record view
sui-overlay(ref='openRecord' @mousedown='()=>viewRecord.close()' style="background-color:rgba(0 0 0 / 60%)")
    .view-record-overlay
        ViewRecord(v-if='recordToOpen && typeof recordToOpen === "object"' ref="viewRecord" :record='recordToOpen' @close="()=>openRecord.close()")

.table-container#data-container
    .header.label-head
        span.not-clickable Table name
        div.not-clickable
            span Size
            span # of records
        Icon.clickable.hideOnTablet(:class="{'animation-rotation': fetchingData}" @click="()=>{ if(!fetchingData) getTables(); }") refresh

    // skeleton(mobile)
    .tableHead.animation-skeleton.showOnTablet(v-if='recordTables === null' v-for="t in numberOfSkeletons()")
        span &nbsp;

    // table list
    template(v-else)
        .no-records(v-if='!recordTables.list.length')
            div
                .title No Record Tables
                p List of tables will show when there is data

        template(v-else-if="groupedTableList && groupedTableList[currentSelectedTableBatch]")
            template(v-for="batchIdx in (viewport === 'desktop' ? [currentSelectedTableBatch + 1] : groupedTableList.length)")
                template(v-for="pageIdx in (viewport === 'desktop' ? [currentSelectedTablePage + 1] : groupedTableList[batchIdx - 1].length)")
                    // when v-for by number, it starts with 1
                    .table-wrapper(v-for="t in groupedTableList[batchIdx - 1][pageIdx - 1]")
                        .tableHead.label-head.clickable(@click='()=>{viewRecordList(t)}')
                            span {{ t.table }}
                            div
                                span {{getSize(t.size)}}
                                span {{t.number_of_records}}

                            template(v-if='t.records')
                                template(v-if="viewport === 'desktop'")
                                    Icon.clickable(v-if="!t.opened") plus
                                    Icon.clickable(v-else) minus

                                Icon.clickable(v-else style="color: rgba(255, 255, 255, .6)") right

                            Icon.animation-rotation(v-else) refresh

                        div(v-if="t.opened && t.records" style="max-height: 60vh;overflow-y: auto;" @scroll.passive="(e)=>getMoreRecords(e, t, serviceId)")
                            .noRecords(v-if='!t.records.list.length')
                                div
                                    sui-flextext(min-size='14' max-size='24') No Records
                                    br
                                    p This table will be automatically removed.

                            .records(v-else v-for="r in t.records.list" style="cursor:pointer;" @click="()=>displayRecord(r)")
                                div
                                    span.label-head RECORD:
                                    span {{ r.record_id }}
                                div
                                    span.label-head USER:
                                    span {{ r.user_id }}
                                div
                                    span.label-head UPLOADED:
                                    span {{ dateFormat(r.uploaded) }}

                            .load-more(v-if="!t.records.endOfList")
                                Icon.animation-rotation refresh

                .paginator.hideOnTablet
                    Icon.arrow(
                        :class="{active: currentSelectedTableBatch || currentSelectedTablePage}"
                        @click="()=>{ if(currentSelectedTablePage) currentSelectedTablePage--; else if(currentSelectedTableBatch) { currentSelectedTablePage = numberOfPagePerBatch - 1; currentSelectedTableBatch--; } }") left
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
                    Icon.arrow(
                        :class="{active: currentSelectedTablePage < groupedTableList[currentSelectedTableBatch].length - 1 || !recordTables.endOfList && currentSelectedTablePage === groupedTableList[currentSelectedTableBatch].length - 1 }"
                        @click="()=>{ if(currentSelectedTablePage < groupedTableList[currentSelectedTableBatch].length - 1 ) currentSelectedTablePage++; else if(!recordTables.endOfList && currentSelectedTablePage === groupedTableList[currentSelectedTableBatch].length - 1) getMoreTables() }") right

.page-action.showOnTablet(@blur="isFabOpen = false")
    // @blur should be at the parent div
    sui-button.fab.open-menu(@click.stop="isFabOpen = !isFabOpen")
        Icon menu_vertical

    Transition
        div(v-if="isFabOpen" @click.stop)
            sui-button.fab(@click="router.push({name: 'mobileSearchRecord'})")
                Icon search
            sui-button.fab(@click='()=>addRecord(true)')
                Icon plus2
</template>
<!-- script below -->
<script setup>
import { inject, ref, watch, computed, nextTick, onMounted, onBeforeUnmount, provide } from 'vue';
import { skapi, getSize, dateFormat, groupArray } from '@/main';
import { useRoute, useRouter } from 'vue-router';
import { tableList, recordTables, refreshTables, getMoreRecords } from './records.js';
import RecordSearch from '@/components/recordSearch.vue';
import ViewRecord from '../../../components/viewRecord.vue';
import Icon from '@/components/Icon.vue';
import { state } from '../../../main';

let openRecord = ref(null);
let recordToOpen = inject('recordToOpen');
const viewRecord = ref(null);
let route = useRoute();
let router = useRouter();
let serviceId = route.params.service;
const service = inject('service');

let pageTitle = inject('pageTitle');

// flag
let fetchingData = inject('fetchingData');
let isFabOpen = ref(false);

// data
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

onMounted(() => {
    if (recordToOpen.value) {
        displayRecord(recordToOpen.value);
    }
});

function addRecord(mobile = false) {
    recordToOpen.value = {};
    if (mobile) {
        router.push({
            name: 'mobileRecordView',
            query: {
                id: 'Add Record'
            }
        });
    }
    else {
        nextTick(() => {
            viewRecord.value.editRecord();
            openRecord.value.open();
        });
    }
}

async function displayRecord(r) {
    if (typeof r === 'string') {
        let rec = await skapi.getRecords({
            service: serviceId,
            record_id: r
        });
        recordToOpen.value = rec.list[0];
        openRecord.value.open();
    }
    else {
        recordToOpen.value = r;
        openRecord.value.open();
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

    getMoreTablesQueue = skapi.getTable({ service: serviceId }, { fetchMore: true, limit: fetchLimit }).catch(err => {
        fetchingData.value = false;
        throw err;
    });

    let t = await getMoreTablesQueue;
    recordTables.value.endOfList = t.endOfList;

    t.list.map(m => {
        if (!tableList.includes(m.table)) {
            tableList.push(m.table);
        }

        m.opened = false;
        m.records = ref(null);

        skapi.getRecords({
            service: serviceId,
            table: { name: m.table }
        }, { limit: fetchLimit }).then(r => {
            m.records.value = r;
        });

        recordTables.value.list.push(m);
    });

    currentSelectedTableBatch.value += 1;
    currentSelectedTablePage.value = 0;

    fetchingData.value = false;
    getMoreTablesQueue = null;
}

function getTables() {
    // initial table fetch
    currentSelectedTablePage.value = 0;
    currentSelectedTableBatch.value = 0;

    fetchingData.value = true;
    refreshTables(serviceId).then(() => {
        fetchingData.value = false;
    });
}

// get tables on created (if not already fetched)
if (!recordTables.value) {
    getTables();
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

watch(() => state.viewport, viewport => {
    if(viewport === 'mobile') {
        pageTitle.value = 'Records';
    } else {
        pageTitle.value = `Service "${service.value.name}"`;
    }
    
    // close opened table on viewport change
    if(groupedTableList.value) {
        for (let t of groupedTableList.value[currentSelectedTableBatch.value][currentSelectedTablePage.value]) {
            t.opened = false;
        }
    }
}, {immediate: true});

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

document.body.classList.add('table');
onBeforeUnmount(() => {
    document.body.classList.remove('table');
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

#recordSearch {
    z-index: 1;
    display: inline-block;
    position: relative;
    max-width: 100%;
}

.table-container {
    background-color: #434343;
    position: relative;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: -1px -1px 1px rgba(0, 0, 0, 0.25),
    inset 1px 1px 1px rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    margin: 20px 0 0 0;
    padding: 24px 20px;

    @media @tablet {
        box-shadow: none;
        padding: 0;
        background-color: transparent;
        border: none;
    }

    svg {
        color: white;
    }

    .header {
        padding: 0 16px 0 16px;
        color: rgba(255, 255, 255, 0.4);
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        & + .table-wrapper {
            margin-top: 24px;
        }
    }

    .table-wrapper {
        background-color: #333333;
        border-radius: 8px;

        .records {
            display: flex;
            flex-wrap: wrap;
            flex-direction: column;
            justify-content: space-between;
            font-size: 14px;
            padding: 16px 20px;

            @media screen and (min-width: 945px) {
                flex-direction: row;
            }

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
                    font-family: Courier;

                    &.label-head {
                        color: rgba(255, 255, 255, 0.6);
                    }
                }
            }
        }

        .load-more {
            text-align: center;
            padding: 8px;
        }
    }


    .label-head {
        &>span {
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

    .no-records {
        color: rgba(255, 255, 255, 0.4);
        padding: 60px 0 60px 0;
        margin: 0 -20px -24px -20px;
        border-radius: 0 0 8px 8px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;

        .title {
            font-size: 28px;
        }

        p {
            margin: 20px 0 0 0;
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

            &.morePage {
                visibility: hidden;

                &.active {
                    cursor: pointer;
                    visibility: visible;
                }
            }
        }

        .arrow {
            color: rgba(255, 255, 255, .15);

            &.active {
                cursor: pointer;
                color: #fff;
            }
        }
    }
}
</style>