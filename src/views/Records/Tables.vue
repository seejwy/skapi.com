<template lang="pug">
.table-container#data-container
    .header.labelHead
        span.not-clickable Table name
        div.not-clickable
            span Size
            span # of records
        span.material-symbols-outlined.clickable(:class="{'animation-rotation': fetchingData}" @click="()=>{ if(!fetchingData) getTables(true); }") cached

    template(v-if='recordTables !== null')
        .noTables(v-if='!recordTables.list.length')
            div
                sui-flextext(min-size='16' max-size='32') No Records
                br
                p List of tables will show when there is data

        template(v-else-if="groupedTableList && groupedTableList[currentSelectedTableBatch]")
            .tableWrapper(v-for="t in groupedTableList[currentSelectedTableBatch][currentSelectedTablePage]")
                .tableHead.labelHead.clickable(@click="t.opened = !t.opened;")
                    span {{ t.table }}
                    div
                        span {{getSize(t.size)}}
                        span {{t.number_of_records}}

                    template(v-if='t.records')
                        span.material-symbols-outlined.clickable(v-if="!t.opened") add_circle
                        span.material-symbols-outlined.clickable(v-else) remove_circle

                    span.material-symbols-outlined.animation-rotation(v-else) cached

                div(v-if="t.opened && t.records" style="max-height: 60vh;overflow-y: auto;" @scroll="(e)=>fetchMoreRecords(e,t)")
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
                        span.material-symbols-outlined.animation-rotation cached<div class="list label clickable" data-v-294b53b9>…</div>flex

            .paginator
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
</template>
<!-- script below -->
<script setup>
import { inject, ref, watch, computed, nextTick } from 'vue';
import { skapi, getSize, dateFormat, groupArray } from '@/main';
import { useRoute } from 'vue-router';
let route = useRoute();
let serviceId = route.params.service;

// flag
let fetchingData = inject('fetchingData');

// data
let recordTables = inject('recordTables');

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
    for (let t of groupedTableList.value[n][currentSelectedTableBatch.value]) {
        t.opened = false;
    }
    nextTick(() => {
        window.document.getElementById('data-container').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
});

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
                })
            };

            fetchingData.value = false;
        }).catch(err => {
            fetchingData.value = false;
            throw err;
        });

    return;
}

getTables();

// fetch table records
let promiseQueue = {};
async function fetchMoreRecords(event, table) {
    if (event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight - 40) {
        if (promiseQueue?.[table.table] instanceof Promise) {
            return;
        }

        promiseQueue[table.table] = await skapi.getRecords({
            service: serviceId,
            table: table.table
        }, { refresh: false, limit: fetchLimit });

        let r = promiseQueue[table.table];
        for (let rec of r.list) {
            table.records.list.push(rec);
        }

        table.records.endOfList = r.endOfList;
        delete promiseQueue[table.table];
    }
}
</script>

<style lang="less" scoped>
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