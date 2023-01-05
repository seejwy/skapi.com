<template lang="pug">
h1 Please Login
sui-input(:value='form.email' @input="e=>form.email = e.target.value" placeholder="email")
br
br
sui-input(:value='form.password' type='password' @input="e=>form.password = e.target.value" placeholder="password")
br
br
sui-button(@click='login') Login

</template>
<script setup>
import { inject, watch, reactive } from 'vue';
import { skapi, state } from '@/main';
import { useRoute, useRouter } from 'vue-router';
let route = useRoute();
let router = useRouter();

// set page title
let pageTitle = inject('pageTitle');
pageTitle.value = 'skapi';

let form = reactive({
    email: 'jinyoon@broadwayinc.com',
    password: 'Bwq14321!!'
});

watch(() => state.user, u => {
    // if logged in, and page is login page go to dashboard
    // when visited via url, can have page flash.
    if (u && route.name === 'login') {
        router.replace('/dashboard');
    }
});

function login() {
    skapi.login(form).then(u => {
        state.user = u;
    });
}

</script>