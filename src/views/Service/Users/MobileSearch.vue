<template lang="pug">
form(
    @submit.prevent="search")
    // navbar for mobile search
    SearchNavBar(v-if='viewport === "mobile"')
        template(v-slot:left)
            Icon.showOnTablet.clickable.back-button(@click="router.push({name: 'users'})") left
        sui-input(
            ref="searchField"
            type="search"
            autocomplete="off"
            :value="searchParams.value"
            @input="(e) => { searchParams.value = e.target.value; e.target.setCustomValidity(''); }"
            required)
        template(v-slot:right) 
            Icon.showOnTablet.placeholder-icon(v-if="!searchParams.value" style='width:32px;') search     
        
.mobile-search-type
    sui-select(
        name='search_type'
        :value="searchParams.searchFor"
        @input="e => {changeSearchType(e.target.value);}")
        option(value="user_id") Search By User ID
        option(value="email") Search By Email
        option(value="phone_number") Search By Phone
        option(value="address") Search By Address
        option(value="gender") Search By Gender
        option(value="name") Search By Name
        option(value="locale") Search By Locale
        option(value="timestamp") Search By Date Created
        option(value="birthdate") Search By Birth Date
        option(value="subscribers") Search By Subscribers
    sui-select(v-if="searchParams.searchFor === 'timestamp' || searchParams.searchFor === 'subscribers' || searchParams.searchFor === 'birthdate'" style="width: 70px; text-align: center;" :value="searchParams.condition" name='search_condition' @change="(e) => searchParams.condition = e.target.value")
        option(value=">=" selected) &gt;=
        option(value="<=") &lt;=
        option(value="=") =
</template>
<script setup>
import { inject, watch, onBeforeUnmount, onMounted, computed, ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { state, skapi } from '@/main';

import Icon from '@/components/Icon.vue';
import SearchNavBar from '@/components/SearchNavBar.vue';

let appStyle = inject('appStyle');
let pageTitle = inject('pageTitle');

pageTitle.value = null;
appStyle.mainPadding = '0';

let viewport = inject('viewport');
let router = useRouter();
let route = useRoute();
const searchField = ref(null);

const searchParams = reactive({
    searchFor: 'user_id',
    condition: '=',
    value: ''
});

const changeSearchType = (value) => {
    let field = searchField.value.children[0];
    field.setCustomValidity('');

    searchParams.searchFor = value;
    if(value === 'user_id') searchParams.condition = '=';
    else searchParams.condition = '>=';
}

const search = () => {
    let field = searchField.value.children[0];
    if(searchParams.searchFor === 'user_id' && !skapi.validate.userId(searchParams.value)) {
        field.setCustomValidity('Please enter a valid USER ID');
        field.reportValidity();
    } else if(searchParams.searchFor === 'email' && !skapi.validate.email(searchParams.value)) {
        field.setCustomValidity('Please enter a valid email');
        field.reportValidity();
    }

    if(field.checkValidity()) {
        router.push({name:"usersSearch", params: {search: searchParams.searchFor}, query: {search: searchParams.searchFor, condition: searchParams.condition, value: searchParams.value}});
    }
}

watch(viewport, viewport => {
    if (viewport === 'desktop') {
        router.replace({ name: 'users' });
    }
}, { immediate: true });

appStyle.background = '#333333';
onBeforeUnmount(() => {
    appStyle.mainPadding = null;
    appStyle.background = null;
});
</script>
<style lang="less" scoped>
.mobile-search-type {
    display: flex;
    margin: 8px 0;
    padding: 8px;
    gap: 16px;
    
    sui-select {
        width: 100%;
        background: rgba(255, 255, 255, 0.08);
        border: 0.5px solid #8C8C8C;
        box-shadow: inset -1px -1px 2px rgb(0 0 0 / 25%), inset 1px 1px 2px rgb(255 255 255 / 65%);
    }
}
</style>