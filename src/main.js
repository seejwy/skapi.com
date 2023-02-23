import { createApp, reactive, watch } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/main.less';
// import { defineCustomElements } from 'skateui/loader';
// defineCustomElements(window);

// init state
const state = reactive({
    user: null,
    viewport: 'desktop',
    connection: null,
    getServices: null,
    services: null,
    showVerificationNotification: true,
    viewportOnChange: (v) => v
});

// init skapi
import Admin from './admin';
let skapi = new Admin();

let awaitConnection = skapi.getConnection().then(c => {
    state.connection = c;
    state.user = skapi.user;
});

watch(() => state.user, user => {
    if (user) {
        state.getServices = new Promise(async res => {
            let services = window.sessionStorage.getItem(user.user_id);
            if (services && services !== 'null') {
                state.services = JSON.parse(services);
                skapi.services = state.services;
            }
            else {
                state.services = (await skapi.getServices());
            }
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

// init document (will use when necessary)

let desktopMedia = '(min-width: 769px)';
let mobileMedia = '(max-width: 768px)';
const desktopSize = window.matchMedia(desktopMedia);
const mobileSize = window.matchMedia(mobileMedia);

const setViewport = (e) => {
    if (e.matches) {
        state.viewport = e.media === desktopMedia ? "desktop" : 'mobile';
        state.viewportOnChange(state.viewport);
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
app.config.warnHandler = function (msg, vm, trace) {
    return null;
};

// get size of record data
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
const log = v => { console.log(v); return v; };
const groupArray = (arr, cg, pg) => {
    // cg - child group
    // pg - parent group
    // [ [ [...], [...], [...] ], [ [...], [...], [...] ], ... ]

    const outputArray = [];

    for (let i = 0; i < arr.length; i += cg) {
        outputArray.push(arr.slice(i, i + cg));
    }

    if (!pg) {
        return outputArray;
    }

    const final = [];
    for (let i = 0; i < outputArray.length; i += pg) {
        final.push(outputArray.slice(i, i + pg));
    }

    return final;
};

const regions = {
    US: 'us-east-1',
    KR: 'ap-northeast-2'
}

const localeName = (locale) => {
    let name = '';

    switch(locale) {
        case 'ap-northeast-2':
            name = 'South Korea';
            break;
    }

    return name;
}

export { skapi, state, getSize, dateFormat, log, groupArray, localeName, regions, awaitConnection };
