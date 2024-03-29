import { createApp, reactive, watch } from 'vue';
import App from './App.vue';
// import './assets/main.less';

// init state
const state = reactive({
    user: null,
    viewport: 'desktop',
    connection: null,
    getServices: null,
    services: null,
    showVerificationNotification: false,
    setVerificationDelay: () => {
        localStorage.setItem('showVerificationMessage', new Date().getTime());
        state.showVerificationNotification = false;
    },
    viewportOnChange: (v) => v,
    blockingPromise: new Promise(res => res())
});

// init skapi
import Admin from './admin';
let skapi = new Admin();

let awaitConnection = skapi.getConnection().then(c => {
    state.connection = c;
    state.user = skapi.user;
    const ONE_DAY = 86400;
    if (!state.user?.email_verified && (Number(localStorage.getItem('showVerificationMessage')) + ONE_DAY) < new Date().getTime()) {
        state.showVerificationNotification = true;
        localStorage.removeItem('showVerificationMessage');
    }
});

watch(() => state.user, user => {
    if (user) {
        state.getServices = new Promise(async res => {
            if (!state.services) {
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
const desktopSize = window.matchMedia(desktopMedia);

const setViewport = (e) => {
    if (e.matches) {
        state.viewport = 'desktop';
    } else {
        state.viewport = 'mobile';
    }
    state.viewportOnChange(state.viewport);
};

setViewport(desktopSize);

desktopSize.addEventListener('change', setViewport);

// init vue
const app = createApp(App);


let mql = window.matchMedia("(max-width: 768px)");
let router;

if (mql.matches) {
    router = import('@/router/mobile.js');
    import('@/assets/mobile.less');
} else {
    router = import('@/router/desktop.js');
    import('@/assets/main.less');
}

router.then((module) => {
    const routes = module.default;

    app.use(routes);
    app.mount('#app');
    app.config.warnHandler = function (msg, vm, trace) {
        return null;
    };

})

const log = v => { console.log(v); return v; };

export { skapi, state, awaitConnection };
