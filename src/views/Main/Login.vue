<template lang="pug">
form.container(@submit.prevent="login")
    h1 Login
    .input
        label Email
        sui-input(
            type="email" 
            :value='form.email' 
            @input="e=>form.email = e.target.value"
            @change="validateEmail"
            placeholder="E.g. someone@gmail.com"
            required)
    .input
        label Password
        sui-input(
            type='password'
            :value='form.password'
            @input="e=>form.password = e.target.value"
            @change="validatePassword"
            placeholder="Enter password" 
            required)
    .action
        label
            sui-input(type="checkbox")
            span Remember Me
        RouterLink(to="/") Forgot Email & Password?
    .error(v-if="error")
        Icon warning
        span {{ error }}
    sui-input(type="submit" value="Login")
    div Not registered yet? 
        RouterLink(to="/signup") Create an account

</template>
<script setup>
import { onMounted, inject, watch, reactive, ref, onBeforeUnmount } from 'vue';
import { skapi, state } from '@/main';
import { useRoute, useRouter } from 'vue-router';

import Icon from '../../components/Icon.vue';

let route = useRoute();
let router = useRouter();
const error = ref(null);
// set page title
let pageTitle = inject('pageTitle');
let appStyle = inject('appStyle');
let viewport = inject('viewport');
const currentBgColor = appStyle.background;
onBeforeUnmount(() => {
    appStyle.background = currentBgColor;
})
if(state.viewport === 'mobile') {
    appStyle.background = '#fff';
}
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

const validateEmail = (event) => {
    if(skapi.validate.email(event.target.value)) {
		event.target.setCustomValidity('');
    } else {
		event.target.setCustomValidity('Invalid Email');
		event.target.reportValidity();
    }
}

const validatePassword = (event) => {
    if(event.target.value.length >= 6 && event.target.value.length <= 60) {
		event.target.setCustomValidity('');
    } else {
		event.target.setCustomValidity('Invalid Password');
		event.target.reportValidity();
    }
}

function login() {
    skapi.login(form).then(u => {
        state.user = u;
    }).catch(e => {
        console.log({e: e.code});
        // UserLambdaValidationException
        // INCORRECT_USERNAME_OR_PASSWORD
        switch(e.code) {
            case 'UserLambdaValidationException':
            case 'INCORRECT_USERNAME_OR_PASSWORD':
                error.value = 'Username or password is incorrect';
                break;
            case 'USER_IS_DISABLED':
                error.value = "This account has been disabled";
                break;
            case 'SIGNUP_CONFIRMATION_NEEDED':            
                router.push('/confirmation');
                break;
            default:
                error.value = "Something went wrong please contact an administrator.";
                throw e;
        }
    });
}
</script>
<style lang="less" scoped>
@import '@/assets/variables.less';

.container {
    text-align: center;
    padding: 40px;
    background: #FAFAFA;
    color: rgba(0, 0, 0, 0.85);
    border-radius: 8px;
    width: 542px;
    max-width: 100%;
    margin-top: 60px;
    
    @media @tablet {
        margin: 40px auto 0;    
        background: #FFF;
        padding: 0;
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
        margin-bottom: 20px;

        svg {
            margin-right: 4px;
        }
        
        & + sui-input[type=submit] {
            margin-top: 0;
        }
    }

    sui-input[type=submit] {
        margin-bottom: 24px;
        margin-top: 40px;
        width: auto;
        min-width: 140px;
    }

    a {
        color: #293FE6;
        text-decoration: none;
        font-weight: bold;
    }
}
</style>