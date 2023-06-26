<template lang="pug">
sui-nav#top-nav(auto-hide)
    .navAlign
        #leftButton
            Icon.clickable.backButton(v-if='!props.isParentLevel' @click="toParent") left
        .title#title(ref="title")
            img.logo(alt="skapi" src="@/assets/img/logo-small.svg" @click="()=>props.isParentLevel ? router.push('/') : null")
        .menu
            #rightButton(ref="rightButton")
                Icon.clickable(style="height: 28px; width: 28px;" @click='open') menu_horizontal

    sui-overlay(ref='navOverlay' transition-time='0.2s' @click='()=>close(true)' style='background-color: rgba(31, 31, 31, .6); color:white;' position="right")
        // nested events do not bubble in sui-overlay, thus adding additional click event to close menu
        #nav-overlay(@click="()=>close(true)")
            slot
</template>
<script setup>
import { inject, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { state } from '@/main';

import Icon from '@/components/Icon.vue';

const props = defineProps({
    isParentLevel: Boolean
});

let navOverlay = ref(null);
let route = useRoute();
let router = useRouter();
let navbarBackDestination = inject('navbarBackDestination');
let rightButton = ref(null)
let title = ref(null)

watch(() => route.name, () => {
    // always close on route change
    close();
});

async function toParent() {
    await state.blockingPromise;
    
    let p = navbarBackDestination.value;
    if (p === 'back') {
        router.go(-1);
    }
    else if (typeof p === 'function') {
        p();
    }
    else if (p?.from && p?.to && route.name === p.from) {
        router.push({ name: p.to });
    }
    else {
        let path = route.fullPath.split('/');
        path.pop();
        router.push(path.join('/'));
    }
}

function close(keepScrollPosition = false) {
    let scrollY = document.body.style.top;
    let isFixed = document.body.style.position === 'fixed';
    if (isFixed) {
        // revert fixed background
        document.body.style.position = '';
        document.body.style.top = '';

        if (keepScrollPosition) {
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    }

    if (navOverlay.value) {
        navOverlay.value.close();
    }
}

function open() {
    // fix background position when menu is opened
    navOverlay.value.open(() => {
        document.body.style.top = `-${window.scrollY}px`;
        document.body.style.position = 'fixed';
    });
}

</script>
<style lang="less">
@import '@/assets/variables.less';

#nav-overlay {
    min-width: 70vw;
    background-color: #1F1F1F;
    height: 100vh;
    padding: 40px 8px;

    ul {
        margin: 0;
        list-style: none;
        padding: 0;

        li {
            a {
                color: #fff;
                text-decoration: none;
                font-family: 'Radio Canada';
                font-weight: 600;
                font-size: 20px;
            }

            display: block;
            margin: 0;
            padding: 0;
            margin-bottom: 28px;
            padding-left: 28px;
        }
    }
}

sui-nav#top-nav {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
    padding: 0 var(--side-padding, 24px);
    color: #fff;

    &>.navAlign {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: auto;
        height: 60px;

        .menu {
            flex-shrink: 0;
            padding-right: 8px;

            ul {
                margin: 0;
                list-style: none;
                padding: 0;

                li {
                    margin: 0 0 0 20px;
                    padding: 0;
                    display: inline-block;

                    a {
                        text-decoration: none;
                        color: #fff;

                        &.router-link-active {
                            font-weight: bold;
                        }
                    }
                }
            }
        }
        .backButton {
            height: 32px;
            width: 32px;
            color: rgba(255, 255, 255, .4);
            margin-right: 4px;
            margin-left: -8px;
        }
        .title {
            flex-grow: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 24px;
            display: inline;
            user-select: none;
            font-size: 20px;
            font-weight: bold;
            vertical-align: middle;
            cursor: pointer;

            .logo {
                cursor: pointer;
            }
        }

        #leftButton,
        #title,
        #rightButton {
            & *:not(:last-child) {
                display: none;
            }
        }
    }
}

.logo {
    height: 35px;
    width: auto;
    vertical-align: middle;
}
</style>