<template lang="pug">
sui-nav#top-nav(auto-hide)
    .nav_align
        .title
            Icon.showOnTablet.clickable.back-button(v-if='!props.isParentLevel' @click="toParent") left
            img.logo(v-if="pageTitle === 'skapi'" alt="skapi" src="@/assets/img/logo.svg" @click="()=>props.isParentLevel ? router.push('/') : null" width="90" height="35")
            span.title-text(v-else:class="{clickable: props.isParentLevel}" @click="()=>props.isParentLevel ? router.push('/') : gotoService()" v-html="pageTitle || ''")
        .menu
            .hideOnTablet
                slot
            template(v-if='navbarMobileRightButton')
                div(v-if="navbarMobileRightButton.type === 'icon'" style="position: relative; width: 24px; height: 24px;")
                    LoadingCircle.showOnTablet(
                        style="width: 24px; height: 24px; --spinnerWidth: 3px; --ringColor: 255, 255, 255; --bgColor: 80,80,80;"
                        @click='navbarMobileRightButton?.callback')
                span.showOnTablet.clickable(
                    v-if="navbarMobileRightButton.type === 'text'"
                    style="height: 28px; font-weight: bold;"
                    :class="navbarMobileRightButton?.cssClass || null"
                    @click='navbarMobileRightButton?.callback') {{ navbarMobileRightButton.val }}
            Icon.showOnTablet.clickable(v-else style="height: 28px; width: 28px;" @click='open') menu_horizontal

    sui-overlay(ref='navOverlay' transition-time='0.2s' @click='()=>close(true)' style='background-color: rgba(31, 31, 31, .6); color:white;' position="right")
        // nested events do not bubble in sui-overlay, thus adding additional click event to close menu
        #nav-overlay(@click="()=>close(true)")
            slot
</template>
<style lang="less">
@import '@/assets/variables.less';

#nav-overlay {
    min-width: 50vw;

    @media @phone {
        min-width: 70vw;
    }

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
    box-shadow: none;
    padding: 0 var(--side-padding, 24px);
    color: #fff;

    @media @tablet {
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
    }

    &>.nav_align {
        display: flex;
        max-width: 1000px;
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

        .title {
            flex-grow: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 24px;

            .logo {
                cursor: pointer;
            }

            .back-button {
                height: 32px;
                width: 32px;
                color: rgba(255, 255, 255, .4);
                margin-right: 4px;
                margin-left: -8px;
            }

            span {
                white-space: nowrap;

                &.title-text {
                    display: inline;
                    user-select: none;
                    font-size: 20px;
                    vertical-align: middle;
                    cursor: pointer;

                    @media @tablet {
                        font-weight: bold;
                    }
                }
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
<script setup>
import { inject, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { state } from '@/main';

import Icon from '@/components/Icon.vue';
import LoadingCircle from '@/components/LoadingCircle.vue';

const props = defineProps(['isParentLevel']);

let pageTitle = inject('pageTitle');
let navbarMobileRightButton = inject('navbarMobileRightButton');
let navOverlay = ref(null);
let route = useRoute();
let router = useRouter();
let navbarBackDestination = inject('navbarBackDestination');

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

function gotoService() {
    if(state.viewport === 'desktop') {
        router.push('/admin/' + route.params.service);
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