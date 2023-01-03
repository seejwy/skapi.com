<template lang="pug">
div(style="padding: 50px 0;")
    h1 Record
    span This is some text

// search form
RecordSearch

sui-button(style='float:right;margin: 8px 0;') + Add Record
div(style="clear:both;")

router-view

</template>
<script setup>
import { inject, provide, ref } from 'vue';
import RecordSearch from '../../components/recordSearch.vue';

let pageTitle = inject('pageTitle');
pageTitle.value = 'Records';
provide('searchResult', ref(null));

</script>