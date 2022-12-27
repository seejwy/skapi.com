import { createApp, reactive, watch } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/main.less';
import { defineCustomElements } from 'skateui/loader';
defineCustomElements(window);

// init state
const state = reactive({
    user: null,
    viewport: 'desktop',
    connection: null,
    getServices: null
});

// init skapi
import Admin from './admin';
let skapi = new Admin();
skapi.awaitConnection().then(c => {
    state.connection = c;
    state.user = skapi.user;
});

watch(() => state.user, user => {
    if (user) {
        state.getServices = skapi.getServices();
    }
    else {
        state.getServices = null
    }
})

// init document
let desktopMedia = '(min-width: 1025px)';
let mobileMedia = '(max-width: 1024px)';
const desktopSize = window.matchMedia(desktopMedia);
const mobileSize = window.matchMedia(mobileMedia);

const setViewport = (e) => {
    if (e.matches) {
        state.viewport = e.media === desktopMedia ? "desktop" : 'mobile';
    }
}

setViewport(desktopSize);
setViewport(mobileSize);

desktopSize.addEventListener('change', setViewport);
mobileSize.addEventListener('change', setViewport);

// init vue
const app = createApp(App);
app.use(router);
app.mount('#app');

export { skapi, state };