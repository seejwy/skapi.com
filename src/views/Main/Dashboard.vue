<template lang="pug">
div(v-if='!state.connection')
    // is loading...

div(v-else-if='state.user')
    h1 The Dashboard
    
Login(v-else)
</template>
<!-- script below -->
<script setup>
import { inject } from 'vue';
import Login from './Login.vue';
import { state } from '@/main';

let pageTitle = inject('pageTitle');
pageTitle.value = 'skapi';

</script>