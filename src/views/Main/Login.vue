<template lang="pug">
sui-overlay(ref="overlay" style="background: rgba(0, 0, 0, 0.6);")
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
        .error(v-if="error")
            Icon warning
            span {{ error }}
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
let overlay;
const error = ref(null);
const open = () => {
    overlay.open();
}
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
        overlay.close();
    }).catch(e => {
        console.log({e: e.code});
        // UserLambdaValidationException
        // INCORRECT_USERNAME_OR_PASSWORD
        switch(e.code) {
            case 'UserLambdaValidationException':
                error.value = 'User does not exist';
                break;
            case 'INCORRECT_USERNAME_OR_PASSWORD':
                error.value = "Password is incorrect";
                break;
            default:
                error.value = "Something went wrong";
        }
    });
}

defineExpose({
    open
});
</script>
<style lang="less" scoped>
@import '@/assets/variables.less';

.container {
    text-align: center;
    max-width: 400px;
    padding: 40px 30px;
    background: #FAFAFA;
    color: rgba(0, 0, 0, 0.85);
    border-radius: 8px;
    
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