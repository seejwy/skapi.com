<template lang="pug">
sui-overlay(ref='openRecord' @click='()=>openRecord.close()' style="background-color:rgba(0 0 0 / 60%)")
    .view-record-overlay
        ViewRecord(:record='recordToOpen' ref='viewRecord' @close="()=>openRecord.close()")

.record-container#data-container
    .recordWrapper.animation-skeleton(v-if='searchResult === null')
        .records.clickable(v-for="t in numberOfSkeletons()")
            div
                span.label &nbsp; 
                span &nbsp;
            div
                span.label &nbsp;
                span &nbsp;
            div
                span.label &nbsp;
                span &nbsp;

    template(v-else)
        div(v-if='!searchResult.list.length')
            .no-records-found
                .title No Records
                p There are no records in this table
        template(v-else)
            .recordWrapper
                .records(v-for="r in searchResult.list" style="cursor:pointer;" @click="()=>displayRecord(r)")
                    div
                        span.label RECORD:
                        span {{ r.record_id }}
                    div
                        span.label USER:
                        span {{ r.user_id }}
                    div
                        span.label UPLOADED: 
                        span {{ dateFormat(r.uploaded) }}
</template>
<!-- script below -->
<script setup>
import { inject, ref, watch, computed, nextTick, onBeforeUnmount, onMounted } from 'vue';
import { skapi, dateFormat, groupArray } from '@/main';
import { useRoute, useRouter } from 'vue-router';

import RecordSearch from '@/components/recordSearch.vue';
import ViewRecord from '../../../components/viewRecord.vue';
import Icon from '@/components/Icon.vue';

let route = useRoute();
let router = useRouter();
let serviceId = route.params.service;
let viewRecord = ref(null);

// record page has darker background in mobile mode
let appStyle = inject('appStyle');
let viewport = inject('viewport');
let record = inject('recordToOpen');
record.value = null;

function adjustBackgroundColor(n) {
    if (n === 'mobile') {
        // remove padding for zebra list to extend to full width
        appStyle.mainPadding = '0';
        appStyle.background = '#333333';
    } else {
        appStyle.mainPadding = null;
        appStyle.background = null;
    }
}

watch(viewport, viewport => {
    adjustBackgroundColor(viewport);
    if(viewport === 'desktop') {
        router.replace({name: 'records'});
    }
}, {
    immediate: true
});

// page title

let pageTitle = inject('pageTitle');
pageTitle.value = route.query.table;

// data
let searchResult = inject('searchResult');

// for paginators
let fetchLimit = 50;

function numberOfSkeletons() {
    // calculated by available vertical space
    return parseInt(window.innerHeight / 2 / 48);
}

function scrollEventMobile(event) {
    if (viewport.value === 'mobile' && (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 40) {
        // scrolled to bottom
        fetchMoreRecords();
    }
}

window.addEventListener('scroll', scrollEventMobile, { passive: true });

onMounted(() => {
    if(searchResult.value) return;
    let params = {
        service: serviceId,
        table: {
            name: route.query.table
        }
    };

    skapi.getRecords(params, { limit: fetchLimit })
        .then(r => {
            searchResult.value = r;
            searchResult.value.params = params;
            fetchMoreRecords();
        }).catch(err => {
            searchResult.value = {
                endOfList: true,
                list: []
            };
            throw err;
        });
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', scrollEventMobile, { passive: true });
    // set padding to original value
    appStyle.mainPadding = null;
    appStyle.background = null;
});

let openRecord = ref(null);

let promiseQueue = null;

async function fetchMoreRecords() {
    let params = {
        service: serviceId,
        table: {
            name: route.query.table
        }
    };

    if (promiseQueue instanceof Promise) {
        return;
    }

    promiseQueue = skapi.getRecords(params, { fetchMore: true, limit: fetchLimit });

    let result = await promiseQueue;
    console.log({result});
    for (let rec of result.list) {
        searchResult.value.list.push(rec);
    }

    searchResult.value.endOfList = result.endOfList;
    result = null;
}

let recordToOpen = inject('recordToOpen');
function displayRecord(r) {
    recordToOpen.value = r;
    if (viewport.value === 'mobile') {
        router.push({
            name: 'mobileRecordView',
            query: {
                id: r.record_id
            }
        });
    }
    else {
        openRecord.value.open();
    }
}

</script>

<style lang="less" scoped>
@import '@/assets/variables.less';
.record-container {
    position: relative;
    margin: 0;
    padding: 0;
    .recordWrapper {
        background-color: #333333;
        border-radius: 8px;
        margin-top: 1.5em;
        margin: 0 !important;

        .records {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            flex-direction: column;
            font-size: 14px;
            padding: 16px 20px;
            border-radius: 0 !important;
            padding-right: 16px !important;
            padding-left: 16px !important;

            
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
                    margin-bottom: 2px !important;
                }

                span {
                    font-family: Courier;
                    display: inline-block;

                    &.label {
                        color: rgba(255, 255, 255, 0.6);
                    }
                }
            }
        }
    }

    @media @phone {
        .recordWrapper {
            .records {
                div {
                    &:not(:last-child) {
                        margin-bottom: 4px !important;
                    }

                    span {
                        display: block !important;
                    }
                }
            }
        }
    }  
    .no-records-found {
        text-align: center;
        border-radius: 0 0 8px 8px;
        color: rgba(255, 255, 255, .4);
        align-items: center;
        text-align: center;
        padding: 60px 0 32px 0;
        
        .title {
            font-size: 28px;
        }
        
        p {
            margin: 20px 0 0 0;
        }
        
        .query {
            margin-top: 16px;
            text-align: center;
            color: rgba(255, 255, 255, .6);
        }
    }
}
</style>