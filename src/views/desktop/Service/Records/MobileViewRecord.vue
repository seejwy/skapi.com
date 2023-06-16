<template lang="pug">
template(v-if="record")
    ViewRecord(ref='viewRecord' :record='record')
.no-records-found(v-else-if="hasNoRecords")
    .title Record Not Found
    p Record does not exist
div(v-else style="text-align: center; padding: 1em;")
    Icon.animation-rotation(style="display:inline-block;width:32px;height:32px;") refresh
</template>
<script setup>
import { inject, watch, onBeforeUnmount, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { skapi } from '@/main';
import Icon from '@/components/ue';
import ViewRecord from '@/components/ViewRecord.vue';

let viewRecord = ref(null);
let appStyle = inject('appStyle');
let pageTitle = inject('pageTitle');
let navbarMobileRightButton = inject('navbarMobileRightButton');
const hasNoRecords = ref(false);

let setMobileButton = () => {
    navbarMobileRightButton.value = {
        type: 'text',
        val: 'Save',
        callback: () => {
            viewRecord.value.saveData().then((res) => {
                if(res) {
                    navbarMobileRightButton.value = {
                        type: 'text',
                        val: 'Edit',
                        callback: editCallback
                    };
                } else {
                    setMobileButton();
                }
            }).catch((e) => {
                console.log({e});
                setMobileButton();
            });
            
            navbarMobileRightButton.value = {
                type: 'icon',
                val: 'loading',
                cssClass: 'animation-rotation--slow-in-out'
            };
        }
    };
}

let editCallback = () => {
    viewRecord.value.editRecord();
    setMobileButton();
};

navbarMobileRightButton.value = {
    type: 'text',
    val: 'Edit',
    callback: editCallback
};

let viewport = inject('viewport');
let router = useRouter();
let route = useRoute();

let record = inject('recordToOpen');
let record_id = route.query.id || null;
pageTitle.value = record_id;

let navbarBackDestination = inject('navbarBackDestination');
navbarBackDestination.value = () => {
    record.value = null;
    router.go(-1);
};

// kick out desktop users, or has no query
if (viewport.value === 'desktop' || record.value === null && !record_id) {
    if (!record.value) {
        record.value = record_id;
    }
    router.push({ name: 'records' });
}

if (!record.value) {
    if(record_id !== 'Add Record') {
        skapi.getRecords({
            service: route.params.service,
            record_id
        }).then(r => {
            if(r.list.length) {
                record.value = r.list[0];
            } else {
                hasNoRecords.value = true;
            }
        });
    } else {
        record.value = {};
    }
}

onMounted(() => {
    appStyle.mainPadding = '0';
    appStyle.background = '#333333';
    if (record.value && typeof record.value === 'object' && !Object.keys(record.value).length) {
        // is add record when empty object
        editCallback();
    }
});

onBeforeUnmount(() => {
    appStyle.mainPadding = null;
    appStyle.background = null;
    navbarMobileRightButton.value = null;
    navbarBackDestination.value = null;
});

watch(viewport, n => {
    if (n === 'desktop') {
        router.replace({ name: 'records' });
    }
});
</script>
<style lang="less">
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
}
</style>