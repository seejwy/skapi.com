<template lang="pug">
RecordSearch
</template>
<script setup>
import { inject, watch } from 'vue';
import { useRouter } from 'vue-router';
import RecordSearch from '../../../components/recordSearch.vue';
let appStyle = inject('appStyle');
let pageTitle = inject('pageTitle');
pageTitle.value = null;
appStyle.background = 'rgb(51, 51, 51)';
let viewport = inject('viewport');
let router = useRouter();

// kick out desktop users
if(viewport.value === 'desktop') {
    router.replace({ name: 'records' });
}
watch(viewport, n => {
    if (n === 'desktop') {
        router.replace({ name: 'records' });
    }
});
</script>