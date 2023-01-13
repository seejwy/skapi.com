<template lang="pug">
div
    h1 Service Dashboard
    h4 {{ service.name }}
    hr
    ul
        li
            router-link(:to="{name:'records'}") Records
        li
            router-link(:to="{name:'users'}") Users

</template>
<script setup>
import { inject } from 'vue';
let service = inject('service');
let pageTitle = inject('pageTitle');
pageTitle.value = 'Service "' + service.value.name + '"'
</script>