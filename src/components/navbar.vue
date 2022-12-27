<template lang="pug">
sui-nav#top-nav(auto-hide)
    .nav_align
        .title
            span.showOnTablet.material-symbols-outlined.clickable.backbutton(v-if='!props.isParentLevel' style='margin-left: -24px;padding-left: 24px;' @click='toParent') arrow_back_ios
            span.titleText.iconText(:class="{clickable: props.isParentLevel}" @click="()=>props.isParentLevel ? router.push('/') : null") {{ pageTitle }}
        .menu
            .hideOnTablet
                slot
            .material-symbols-outlined.more-button.showOnTablet.clickable(style='margin-right: -24px;padding-right: 24px;' @click='open') more_horiz

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
    padding: 70px 8px;

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
    padding: 0 24px;
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

            ul {
                margin: 0;
                list-style: none;
                padding: 0;

                li {
                    margin: 0 0 0 20px;
                    padding: 0;
                    display: inline-block;

                    a {
                        color: inherit;
                        text-decoration: none;
                    }
                }
            }

            .more-button {
                font-size: 32px;
            }
        }

        .title {
            flex-grow: 1;
            overflow: hidden;
            text-overflow: ellipsis;

            span {
                &.backbutton {
                    display: inline;
                    font-size: 24px;
                    color: rgba(255, 255, 255, .4);
                    margin-right: 4px;
                }

                &.titleText {
                    display: inline;
                    font-weight: 700;
                    user-select: none;
                    font-size: 24px;
                }
            }
        }
    }
}
</style>

<script setup>
import { inject, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const props = defineProps(['isParentLevel']);

let pageTitle = inject('pageTitle');
let navOverlay = ref(null);
let route = useRoute();
let router = useRouter();

watch(() => route.name, () => {
    // always close on route change
    close();
});

function toParent() {
    let path = route.fullPath.split('/');
    path.pop();
    router.push(path.join('/'));
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