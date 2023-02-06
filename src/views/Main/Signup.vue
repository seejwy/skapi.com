<template lang="pug">
form.container(@submit.prevent="signup")
    h1 Signup
    .input
        label User Name
        sui-input(type="text" :value='form.username' @input="e=>form.username = e.target.value" placeholder="Enter your username")
    .input
        label Email
        sui-input(@change="validateEmail" :value='form.email' @input="e=>form.email = e.target.value" placeholder="E.g. someone@gmail.com" required)
    .input
        label Password
        sui-input(@change="validatePassword" :value='form.password' type='password' @input="e=>form.password = e.target.value" placeholder="Create a password" required)
    .input
        label Password Confirm
        sui-input(@change="validatePasswordConfirm" :value='form.password_confirm' type='password' @input="e=>form.password_confirm = e.target.value" placeholder="Retype your password" required)
    .error(v-if="error")
        Icon warning
        span {{ error }}
    sui-input(type="submit" value="Create Account")
    div Already have an account?&nbsp;
        RouterLink(to="/dashboard") Login

</template>
<script setup>
import { inject, watch, reactive, ref } from 'vue';
import { skapi, state } from '@/main';
import { useRoute, useRouter } from 'vue-router';

import Icon from '../../components/Icon.vue';

let route = useRoute();
let router = useRouter();
const error = ref(null);

// set page title
let pageTitle = inject('pageTitle');
pageTitle.value = 'skapi';

let form = reactive({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
});

watch(() => state.user, u => {
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

const validatePasswordConfirm = (event) => {
    if(event.target.value !== form.password) {
		event.target.setCustomValidity('Password does not match');
		event.target.reportValidity();
    } else {
		event.target.setCustomValidity('');
    }
}

function signup() {
    skapi.signup({email: form.email, password: form.password, name: form.username}, {confirmation: true}).then(result => {
        router.push('/confirmation');
    }).catch(e => {
        console.log({e});
        console.log({e: e.code});
        // INVALID_PARAMETER
        // Exists

        switch(e.code) {
            case 'INVALID_PARAMETER':
                error.value = 'Email or password is invalid';
                break;
            case 'EXISTS':
                error.value = "This email is already in user";
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
    position: absolute;
    text-align: center;
    padding: 40px;
    background: #FAFAFA;
    border-radius: 8px;
    width: 542px;
    max-width: 100%;
    border: 1px solid #808080;
    box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    @media @tablet {
        position: absolute;
        width: 100%;
        top: unset;
        left: 0;
        transform: none;
        border-radius: 0;
        box-shadow: none;
        border: none;
        background: #FFF;
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

    sui-input[type=submit] {
        margin-bottom: 24px;
    }

    a {
        color: #293FE6;
        text-decoration: none;
        font-weight: bold;
    }
}
</style>