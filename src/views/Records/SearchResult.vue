<template lang="pug">
.record-container#data-container
    .header
        span.not-clickable {{ fetchingData ? "Searching" : "Result of"}} {{ route.query.search_type.replace('_', ' ') }}: "{{ route.query[route.query.search_type === 'user' ? 'reference' : route.query.search_type] }}" {{ fetchingData ? '...' : '' }}
        span.material-symbols-outlined.not-clickable.animation-rotation(style='opacity:0.6;' v-if="fetchingData") cached
        .clickable(v-else @click="()=>{ searchResult=null; currentSelectedRecordPage=0; currentSelectedRecordBatch=0; router.push({name:'records'})}")
            span(style="vertical-align:middle;") Clear
            span.material-symbols-outlined close

    .searchPoints(v-if="route.query?.access_group")
        span(v-if='route.query?.access_group') Access Group: {{ route.query.access_group === '0' ? 'Public' : route.query.access_group === '1' ? 'Registered' : route.query.access_group }}
        span(v-if='route.query?.subscription') Subscription: {{ route.query.subscription === 'null' ? 'None' : route.query.access_group === 'true' ? 'Subscribed' : 'Public' }}
        span(v-if='route.query.search_type === "table" && route.query?.reference') Reference: {{ route.query.reference }}
        span(v-if='route.query?.index_name') Index: {{ route.query.index_name }}, Value: {{ route.query.index_value }}, Condition: {{ route.query.index_condition }}
        span(v-if="route.query?.tag") Tag: {{ route.query.tag }}

    template(v-if='searchResult !== null')
        .noRecords(v-if='!searchResult.list.length')
            div
                sui-flextext(min-size='16' max-size='32') No Records
                br
                p There was no record matching the query.

        template(v-else-if="groupedRecordList && groupedRecordList[currentSelectedRecordBatch]")
            .recordWrapper
                .records.clickable(v-for="r in groupedRecordList[currentSelectedRecordBatch][currentSelectedRecordPage]")
                    div
                        span.label RECORD: 
                        span {{ r.record_id }}
                    div
                        span.label UPLOADED: 
                        span {{ dateFormat(r.uploaded) }}
                    div
                        span.label USER: 
                        span {{ r.user_id }}

            .paginator
                span.material-symbols-outlined.arrow(
                    style="transform: rotate(180deg)"
                    :class="{active: currentSelectedRecordBatch || currentSelectedRecordPage}"
                    @click="()=>{ if(currentSelectedRecordPage) currentSelectedRecordPage--; else { currentSelectedRecordPage = numberOfPagePerBatch - 1; currentSelectedRecordBatch--; } }") arrow_forward_ios
                span.morePage(
                    :class="{active: currentSelectedRecordBatch}"
                    @click="()=>{ if(currentSelectedRecordBatch > 0) {currentSelectedRecordBatch--; currentSelectedRecordPage = numberOfPagePerBatch - 1} }") ...

                span.page(
                    v-for="(i, idx) in groupedRecordList[currentSelectedRecordBatch].length"
                    :class="{active: idx === currentSelectedRecordPage}"
                    @click="()=>currentSelectedRecordPage = idx") {{ currentSelectedRecordBatch * numberOfPagePerBatch + i }}

                span.morePage(
                    :class="{active: !searchResult.endOfList || groupedRecordList.length - 1 > currentSelectedRecordBatch }"
                    @click="fetchMoreRecords") ...
                span.material-symbols-outlined.arrow(
                    :class="{active: currentSelectedRecordPage < groupedRecordList[currentSelectedRecordBatch].length - 1 || !searchResult.endOfList && currentSelectedRecordPage === groupedRecordList[currentSelectedRecordBatch].length - 1 }"
                    @click="()=>{ if(currentSelectedRecordPage < groupedRecordList[currentSelectedRecordBatch].length - 1 ) currentSelectedRecordPage++; else if(!searchResult.endOfList && currentSelectedRecordPage === groupedRecordList[currentSelectedRecordBatch].length - 1) fetchMoreRecords() }") arrow_forward_ios
</template>
<!-- script below -->
<script setup>
import { inject, ref, watch, computed, nextTick } from 'vue';
import { skapi, dateFormat, groupArray } from '@/main';
import { useRoute, useRouter } from 'vue-router';
let route = useRoute();
let router = useRouter();
let serviceId = route.params.service;

// flag
let fetchingData = inject('fetchingData');

// data
let searchResult = inject('searchResult');

// for paginators
let fetchLimit = 50;
let numberOfRecordPerPage = 10;
let numberOfPagePerBatch = fetchLimit / numberOfRecordPerPage;

let currentSelectedRecordPage = ref(0);
let currentSelectedRecordBatch = ref(0);

let groupedRecordList = computed(() => {
    if (!searchResult.value || !searchResult.value.list.length) {
        currentSelectedRecordBatch.value = 0;
        return null;
    }
    let recList = groupArray(searchResult.value.list, numberOfRecordPerPage, numberOfPagePerBatch);
    return recList;
});

watch(currentSelectedRecordPage, n => {
    // close opened table on page change
    for (let t of groupedRecordList.value[currentSelectedRecordBatch.value][n]) {
        t.opened = false;
    }
    nextTick(() => {
        window.document.getElementById('data-container').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
});

// event
let promiseQueue = null;
async function fetchMoreRecords() {
    if (searchResult.value.endOfList && groupedRecordList.value.length - 1 === currentSelectedRecordBatch.value) {
        return;
    }

    fetchingData.value = true;

    if (groupedRecordList.value.length - 1 > currentSelectedRecordBatch.value) {
        currentSelectedRecordBatch.value += 1;
        currentSelectedRecordPage.value = 0;
        fetchingData.value = false;
        return;
    }

    if (promiseQueue instanceof Promise) {
        return;
    }

    fetchingData.value = true;
    promiseQueue = skapi.getRecords(searchResult.value.params, { refresh: false, limit: fetchLimit });
    
    await promiseQueue;

    for (let rec of promiseQueue.list) {
        searchResult.value.list.push(rec);
    }
    fetchingData.value = false;

    searchResult.value.endOfList = promiseQueue.endOfList;
    
    currentSelectedRecordBatch.value += 1;
    currentSelectedRecordPage.value = 0;

    fetchingData.value = false;
    promiseQueue = null;
}
</script>

<style lang="less" scoped>
.record-container {
    sui-input {
        input::placeholder {
            color: rgba(255, 255, 255, .6);
        }
    }

    .material-symbols-outlined {
        color: white;
    }

    clear: both;
    background-color: #434343;
    position: relative;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: -1px -1px 1px rgba(0, 0, 0, 0.25),
    inset 1px 1px 1px rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    margin: 0;
    margin-top: 36px;
    padding: 24px 20px;

    .searchPoints {
        padding-top: 16px;
        font-weight: bold;

        &>span {
            display: inline-block;
            background: rgba(255, 255, 255, 0.12);
            color: rgba(255, 255, 255, 0.6);
            border-radius: 12px;
            padding: .7em;
            margin: 2px;
        }
    }

    .header {
        padding: 0 16px;
        color: rgba(255, 255, 255, 0.4);
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;
        vertical-align: middle;

        span {
            color: white;
            font-weight: bold;
        }
    }

    .recordWrapper {
        background-color: #262626;
        border-radius: 8px;
        margin-top: 1.5em;

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
            }
        }
    }

    .noRecords {
        padding: 32px 0;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        background-color: #262626;
        margin-top: 1.5em;
        border-radius: 8px;

        &>* {
            opacity: 0.6;
        }

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