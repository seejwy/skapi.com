<template lang="pug">
div
    h1 Service Dashboard
    p {{ service.name }}

</template>
<script setup>
import { inject } from 'vue';
import { useRoute } from 'vue-router';
let route = useRoute();
let service = inject('service');
let pageTitle = inject('pageTitle');
pageTitle.value = 'Service "' + service.value.name + '"'
</script>