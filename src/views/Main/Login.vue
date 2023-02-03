<template lang="pug">
sui-overlay(ref="overlay")
    .container
        h1 Login
        .input
            label Email
            sui-input(:value='form.email' @input="e=>form.email = e.target.value" placeholder="E.g. someone@gmail.com")
        .input
            label Password
            sui-input(:value='form.password' type='password' @input="e=>form.password = e.target.value" placeholder="Enter password")
        .action
            label
                sui-input(type="checkbox")
                span Remember Me
            RouterLink(to="/") Forgot Email & Password?
        .error(v-if="true")
            Icon warning
            span There is an error message going on here!!
        sui-button(@click='login') Login
        div Not registered yet? 
            RouterLink(to="/") Create an account

</template>
<script setup>
import { onMounted, inject, watch, reactive, ref } from 'vue';
import { skapi, state } from '@/main';
import { useRoute, useRouter } from 'vue-router';

import Icon from '../../components/Icon.vue';

let route = useRoute();
let router = useRouter();
const overlay = ref(null);

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

onMounted(() => {
    console.log(overlay.value);
    overlay.value.open();
})

</script>
<style lang="less" scoped>
@import '@/assets/variables.less';

.container {
    text-align: center;
    margin: 100px auto 0;
    max-width: 400px;

    @media @tablet {
        margin-top: 50px;
    }

    & > * {
        width: 100%;
    }

    h1 {
        font-size: 32px;
        margin: 0 0 36px 0;
    }

    .input {
        margin: 20px auto 12px;

        label {
            display: block;
            text-align: left;
            font-weight: bold;
            color: rgba(0, 0, 0, 0.65);
            margin-bottom: 8px;
        }
        sui-input {
            width: 100%;
            border: 1px solid #8C8C8C;
        }
    }
    .action {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;

        label {
            cursor: pointer;

            sui-input {
                vertical-align: middle;
                margin-right: 4px;
            }

            span {
                vertical-align: middle;
                color: rgba(0, 0, 0, 0.65);
            }
        }

        a {
            font-weight: normal;
        }
    }

    .error {
        text-align: left;
        color: #EB1717;
        margin-bottom: 27px;

        svg {
            margin-right: 4px;
        }
    }

    sui-button {
        margin-bottom: 24px;
    }

    a {
        color: #293FE6;
        text-decoration: none;
        font-weight: bold;
    }
}
</style>