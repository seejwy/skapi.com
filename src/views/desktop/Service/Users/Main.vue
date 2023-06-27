<template lang="pug">
router-view
</template>

<script setup>
import { provide, ref } from 'vue';
// import { state } from '@/main';
// import { useRouter } from 'vue-router';
// let router = useRouter();
provide('searchResult', ref(null));
</script>