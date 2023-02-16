<template lang="pug">
RecordSearch
</template>
<script setup>
import { inject, watch, onBeforeUnmount, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import RecordSearch from '../../../components/recordSearch.vue';

let appStyle = inject('appStyle');
let pageTitle = inject('pageTitle');

pageTitle.value = null;
let viewport = inject('viewport');
let router = useRouter();
let route = useRoute();

onMounted(() => {
    appStyle.mainPadding = '0';
});

// kick out desktop users
if (viewport.value === 'desktop') {
    router.replace({ name: 'records' });
}
watch(viewport, n => {
    if (n === 'desktop') {
        router.replace({ name: 'records' });
    }
});

appStyle.background = '#333333';
onBeforeUnmount(() => {
    appStyle.mainPadding = null;
    appStyle.background = null;
});
</script>