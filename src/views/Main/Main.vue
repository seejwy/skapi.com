<template lang="pug">
NavBar(:is-parent-level='true' style='background-color: var(--primary-color);')
    ul.iconText(@click='bypassSameRoute')

        li
            router-link(to="/") Documentation

        li(v-if='state.user')
            router-link(to="/dashboard") Dashboard

        template(v-if='state.connection')

            template(v-if='state.user')
                li
                    router-link(to="/") Account Settings

                li
                    a.clickable(@click='()=>skapi.logout().then(() => state.user = null)') Logout

            template(v-else)
                li
                    router-link(to="/login") Login

                li.showOnTablet
                    router-link(to="/") Sign-up

                li.hideOnTablet
                    sui-button.signup(@click="()=>router.push('/')") Sign-up

main
    router-view

</template>
<style lang="less" scoped>
@import '@/assets/variables.less';

sui-button.signup {
    background-color: #fff;
    color: var(--primary-color);
    height: 30px;
}
</style>

<script setup>
import NavBar from '@/components/navbar.vue';
import { inject } from 'vue';
import { state, skapi } from '@/main';
import { useRouter, useRoute } from 'vue-router';

let router = useRouter();
let route = useRoute();
let appColor = inject('appColor');
appColor.background = '#F5F5F5';
appColor.color = 'rgba(0 0 0 / 85%)';

function bypassSameRoute(e) {
    // bypass when same route is clicked
    let routeName = {
        'Dashboard': 'dashboard',
        'Login': 'login'
    }[e.target.textContent.trim()]

    if (routeName && route.name !== routeName) {
        e.stopPropagation();
    }
}
</script>