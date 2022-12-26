<template lang="pug">
NavBar(:is-parent-level='true')
    ul.iconText(@click.stop)
        li
            router-link(to="/dashboard" tag="li") Dashboard
        li
            router-link(to="/" tag="li") Documentation
        li
            router-link(to="/" tag="li") Account Settings
        li
            router-link(to="/" tag="li") Logout
            
main
    router-view

</template>
<script setup>
import NavBar from '@/components/navbar.vue';
import { inject } from 'vue';
let appColor = inject('appColor');
appColor.background = '#F5F5F5';
appColor.color = 'rgba(0 0 0 / 85%)';

</script>