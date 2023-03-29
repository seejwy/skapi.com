<template lang="pug">
form.container.login(@submit.prevent="login" action="")
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
        PasswordInput(@input="e=>form.password = e.target.value" :value='form.password' @change="validatePassword" placeholder="Enter password" :required="true")
    .action
        label
            sui-input(type="checkbox" 
                @input="(e)=>rememberme = e.target.checked"
				:checked="rememberme ? true : null")
            span Stay logged in
        RouterLink(:to="{name: 'forgotpassword'}") Forgot Email & Password?
    .error(v-if="error")
        Icon warning
        span {{ error }}
    SubmitButton(:loading="promiseRunning") Login
    //- sui-input(type="submit" value="Login")
    div Not registered yet? 
        RouterLink(to="/signup") Create an account

</template>
<script setup>
import { onMounted, inject, watch, reactive, ref, onBeforeUnmount } from 'vue';
import { skapi, state } from '@/main';
import { useRoute, useRouter } from 'vue-router';

import Icon from '../../components/Icon.vue';
import SubmitButton from '../../components/SubmitButton.vue';
import PasswordInput from '../../components/PasswordInput.vue';

let route = useRoute();
let router = useRouter();
const error = ref(null);
const rememberme = ref(false);
const promiseRunning = ref(false);

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
    email: '',
    password: ''
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
    promiseRunning.value = true;
    skapi.AdminLogin(form, null, rememberme.value).then(u => {
        state.user = u;
    }).catch(e => {
        // UserLambdaValidationException
        // INCORRECT_USERNAME_OR_PASSWORD
        promiseRunning.value = false;
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
    border: 1px solid #808080;
    box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.25);
    border-radius: 8px;

    @media @tablet {  
        margin: var(--head-space) auto 0;
        background: #FFF;
        padding: 0 20px;
        border: 0;
        box-shadow: none;
    }
    
    @media @tablet {  
        padding: 0 16px;
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
        sui-input,
        .sui-input {
            width: 100%;
        }

        sui-input {    
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

    sui-button[type=submit] {
        margin: 40px 0 24px;
    }

    a {
        color: #293FE6;
        text-decoration: none;
        font-weight: bold;
    }
}
.dashboard [type=checkbox] {
    border-color: var(--primary-color);

    &[checked] {
      color: #fff;
      background: var(--primary-color);
    }
}
</style>