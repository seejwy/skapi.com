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
    getServices: null,
    services: null
});

// init skapi
import Admin from './admin';
let skapi = new Admin();

skapi.awaitConnection().then(c => {
    console.log(skapi);
    state.connection = c;
    state.user = skapi.user;
});

watch(() => state.user, user => {
    if (user) {
        state.getServices = new Promise(async res => {
            let services = window.sessionStorage.getItem(user.user_id);
            if (services && services !== 'null') {
                state.services = JSON.parse(services);
            }
            else {
                state.services = (await skapi.getServices());
            }

            console.log({ services: state.services });

            res(state.services);
        });
    }
    else {
        state.getServices = null;
    }
});

function storeServices() {
    if (state.user) {
        window.sessionStorage.setItem(state.user.user_id, JSON.stringify(state.services));
    }
}

// attach event to save service list on close
window.addEventListener('beforeunload', storeServices);
window.addEventListener("visibilitychange", storeServices);

// init document
let desktopMedia = '(min-width: 1025px)';
let mobileMedia = '(max-width: 1024px)';
const desktopSize = window.matchMedia(desktopMedia);
const mobileSize = window.matchMedia(mobileMedia);

const setViewport = (e) => {
    if (e.matches) {
        state.viewport = e.media === desktopMedia ? "desktop" : 'mobile';
    }
};

setViewport(desktopSize);
setViewport(mobileSize);

desktopSize.addEventListener('change', setViewport);
mobileSize.addEventListener('change', setViewport);

// init vue
const app = createApp(App);
app.use(router);
app.mount('#app');

const getSize = (size) => {
    if (size >= 1000000000) {
        return `${(size / 1000000000).toFixed(1)} GB`;
    } else if (size >= 1000000) {
        return `${(size / 1000000).toFixed(1)} MB`;
    } else if (size >= 1000) {
        return `${(size / 1000).toFixed(1)} KB`;
    }

    return `${size} B`;
};
const dateFormat = (timestamp) => {
    let date = new Date(timestamp);
    let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    let mins = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    let secs = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    let month = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth();
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

    return `${date.getFullYear()}.${month}.${day} ${hours}:${mins}:${secs}`;
};
export { skapi, state, getSize, dateFormat };