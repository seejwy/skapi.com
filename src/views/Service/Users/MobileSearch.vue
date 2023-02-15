<template lang="pug">
form(
    @submit.prevent="search")
    // navbar for mobile search
    .mobile-search-nav(v-if='state.viewport === "mobile"')
        Icon.showOnTablet.clickable.back-button(@click="router.push({name: 'users'})") left
        sui-input(
            type="search"
            autocomplete="off"
            :value="searchParams.value"
            @input="(e) => searchParams.value = e.target.value"
            required)
        Icon.showOnTablet.placeholder-icon(v-if="!searchParams.value" style='width:32px;') search
.mobile-search-type
    sui-select(
        name='search_type'
        :value="searchParams.searchFor"
        @input="e => {changeSearchType(e.target.value);}")
            option(value="user_id" selected) User ID
            option(value="email") Email
            option(value="name") Name
</template>
<script setup>
import { inject, watch, onBeforeUnmount, onMounted, computed, ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { state, skapi } from '@/main';

import Icon from '@/components/Icon.vue';

let appStyle = inject('appStyle');
let pageTitle = inject('pageTitle');

pageTitle.value = null;
appStyle.background = 'rgb(51, 51, 51)';
appStyle.mainPadding = '0';

let viewport = inject('viewport');
let router = useRouter();
let route = useRoute();

const searchParams = reactive({
    searchFor: 'user_id',
    condition: '=',
    value: ''
});

const changeSearchType = (value) => {
    searchParams.searchFor = value;
    if(value === 'user_id') searchParams.condition = '=';
    else searchParams.condition = '>=';
}

const search = () => {
    router.push({name:"usersSearch", params: {search: searchParams.searchFor}, query: {search: searchParams.searchFor, condition: searchParams.condition, value: searchParams.value}});
}

watch(viewport, viewport => {
    if (viewport === 'desktop') {
        appStyle.background = '#595959';
        router.replace({ name: 'users' });
    }
}, { immediate: true });

onBeforeUnmount(() => {
    appStyle.mainPadding = null;
    appStyle.background = '#595959';
});
</script>
<style lang="less" scoped>
.mobile-search-nav {
    position: sticky;
    top: 0;
    height: 60px;
    display: flex;
    align-items: center;
    margin-bottom: 28px;
    background-color: #333;
    z-index: 1;
    padding: 0 8px;

    &::after {
        display: block;
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 0;
        content: '';
        height: 1px;
        background-color: rgba(255 255 255 / 60%);
        box-shadow: 0px 2px 0 0 rgba(0, 0, 0, 0.2);
    }

    .back-button {
        display: inline;
        height: 32px;
        width: 32px;
        color: rgba(255, 255, 255, .4);
    }

    sui-input {
        box-shadow: none;
        width: 100%;

        input:focus {
            outline: none;
        }

        &+span {
            position: absolute;
            right: 8px;
        }
    }
}

.mobile-search-type {
    padding: 0 8px;

    sui-select {
        width: 100%;
        background: rgba(255, 255, 255, 0.08);
        border: 0.5px solid #8C8C8C;
        box-shadow: inset -1px -1px 2px rgb(0 0 0 / 25%), inset 1px 1px 2px rgb(255 255 255 / 65%);
    }
}
</style>