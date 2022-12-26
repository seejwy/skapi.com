<template lang="pug">
NavBar(:is-parent-level='true')
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
import NavBar from '@/components/navbar.vue'
</script>