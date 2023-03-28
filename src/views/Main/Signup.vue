<template lang="pug">
.wrapper
    form.container(@submit.prevent="signup")
        h1 Signup
        .input
            label Email
            sui-input(@change="validateEmail" :value='form.email' @input="e=>form.email = e.target.value" placeholder="E.g. someone@gmail.com" required)
        .input
            label Name
            sui-input(type="text" :value='form.username' @input="e=>form.username = e.target.value" placeholder="Enter your name")
        .input
            label Password            
            PasswordInput(ref="passwordField" @input="e=> { form.password = e.target.value; e.target.setCustomValidity(''); }" :value='form.password' @change="validatePassword" placeholder="Create a password" :required="true")
        .input
            label Password Confirm
            PasswordInput(ref="confirmPasswordField" @input="e=> { form.password_confirm = e.target.value; e.target.setCustomValidity(''); }" :value='form.password_confirm' @change="validatePassword" placeholder="Retype your password" :required="true")
        .error(v-if="error")
            Icon warning
            span {{ error }}
        SubmitButton(:loading="promiseRunning") Create Account
        div Already have an account?&nbsp;
            RouterLink(to="/dashboard") Login
        //- .terms By signing up, you’re agree to our #[RouterLink(to="/") Terms & Conditions] #[span and ] #[RouterLink(to="/") Privacy Policy]
</template>
<script setup>
import { inject, watch, reactive, ref, onBeforeMount } from 'vue';
import { skapi, state } from '@/main';
import { useRoute, useRouter } from 'vue-router';

import Icon from '../../components/Icon.vue';
import SubmitButton from '../../components/SubmitButton.vue';
import PasswordInput from '../../components/PasswordInput.vue';

let route = useRoute();
let router = useRouter();
const error = ref(null);
const page = ref('signup');
const secondsTillReady = ref(null);
const promiseRunning = ref(false);
const passwordField = ref(null);
const confirmPasswordField = ref(null);

// set page title
let pageTitle = inject('pageTitle');
pageTitle.value = 'skapi';

onBeforeMount(async() => {
    await skapi.getConnection().then(() => {
        if(state.user) router.push({name: 'dashboard'});
    })
});

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

const validatePassword = () => {
    if(form.password.length < 6 || form.password.length > 60) {
		passwordField.value.setError('Invalid Password');
    } else if(form.password_confirm !== form.password) {
        confirmPasswordField.value.setError('Password does not match');
    } else {
		passwordField.value.clearError();
        confirmPasswordField.value.clearError();
    }
}

function signup() {
    promiseRunning.value = true;
    skapi.signup({email: form.email, password: form.password, name: form.username}, {confirmation: '/success'}).then(result => {
        router.push('/confirmation');
    }).catch(e => {
        console.log({e});
        // console.log({e});
        // console.log({e: e.code});
        // INVALID_PARAMETER
        // Exists
        promiseRunning.value = false;

        switch(e.code) {
            case 'INVALID_PARAMETER':
                error.value = 'Email or password is invalid';
                break;
            case 'EXISTS':
                error.value = "This email is already in use";
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
.wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 0;
    min-height: calc(100vh - 140px);

    @media @tablet {
        align-items: flex-start;
        padding: 0;
    }
}
.container {
    text-align: center;
    padding: 40px;
    background: #FAFAFA;
    border-radius: 8px;
    width: 542px;
    max-width: 100%;
    border: 1px solid #808080;
    box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    margin-top: 60px;

    @media @tablet {
        width: 100%;
        border-radius: 0;
        box-shadow: none;
        border: none;
        background: #FFF;
        padding: 0;
        margin-top: var(--head-space);
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
        margin: 20px auto;

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

    // .terms {
    //     font-size: 12px;
    //     margin-top: 20px;

    //     a {
    //         font-weight: normal;
    //     }
    // }
}
</style>