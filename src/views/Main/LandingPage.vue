<template lang="pug">
.shell
    .landing-page
        h1.hero
            span.highlight Backend framework 
            span for Frontend Developers
            br
            | Build 
            span.highlight fast 
            | and 
            span.highlight scalable 
            | web&nbsp;services 
            br.hide_on_tablet
            span based on the 
            span
                span.highlight Serverless
                |  technology
        router-link(to="/signup")
            sui-button Get Started
        hr
        h2 Skapi Features
        .features
            div
                .title
                    .material-symbols-outlined dns
                    | &nbsp;
                    h3.iconText Database
                p.
                    Auto indexed scalable database.#[br]
                    Skapi's database combines the best of both 
                    relational and nosql architectures.
            div
                .title
                    .material-symbols-outlined manage_accounts
                    | &nbsp;
                    h3.iconText Authentication
                p.
                    From general user login features to complex verifications ,#[br]
                    Skapi provides the simplest way to set up authentication for your web services.
            div
                .title
                    .material-symbols-outlined sync_alt
                    | &nbsp;
                    h3.iconText HTML Friendly
                p.
                    Compatible on both vanilla HTML projects and SPA frameworks.#[br]
                    Skapi is focused on getting the basics right without any additional setups or installations.
            div
                .title
                    .material-symbols-outlined exit_to_app
                    | &nbsp;
                    h3.iconText Cloud storage
                p.
                    Highly accessible cloud storage.#[br]
                    Intergrated with Skapi's database,#[br]
                    indexing and security restrictions is provided by default.
            div
                .title
                    .material-symbols-outlined mark_as_unread
                    | &nbsp;
                    h3.iconText E-Mail Service
                p.
                    Skapi's e-mail endpoint addresses makes sending newsletters and setting up welcome e-mails easier.
            div
                a(href="/docs/index.html" target="_blank")
                    sui-button Read the Docs
        hr
        h2 Getting Started
        .how
            h3 Import skapi
            p ...For SPA applications you can use "npm i skapi"
            .ex
                pre {{ex_html_import}}
        .how
            h3 ...for npm users
            .ex
                pre npm i skapi-js
        .how
            h3 Initialize skapi
            .ex
                pre.
                    let skapi = new Skapi('your_service_id', 'your_user_id')#[br]
                    skapi.login({
                        email: 'user@email.com',
                        password: 'xxxxxx'
                    }).then(user=&gt; console.log(user));
        .how
            h3 Skapi works well on HTML
            p.
                Skapi is designed to work well with vanilla HTML forms as well.#[br]
                Example below shows a full example of HTML login page.
            .ex
                pre {{ex_html}}
        hr
        h2 Updates
        .updates
            h3
                | skapi is on ALPHA! 
                span 2022-10-30
            p.
                Hi, we just released an alpha version of our skapi.
        hr
        img(src="@/assets/img/logo-blue.svg" @click="navigate" :href="href" alt="Skapi" style="width:88px;display: inline-block;vertical-align: middle;")
        p(style="display: inline-block;vertical-align: middle;") © broadwayInc.
        br
        br
</template>
    
<script setup>
import { inject } from 'vue';
let pageTitle = inject('pageTitle');
pageTitle.value = 'skapi';

let ex_html_import = '<script src="https://broadwayinc.dev/jslib/0.0.56/skapi.js">';
let ex_html = `<!DOCTYPE html>
<head>
    <script src="https://broadwayinc.dev/jslib/0.0.56/skapi.js">
</head>
<script>
    var skapi = new Skapi('your_service_id', 'your_user_id');
<\/script>
<body>
    <form onsubmit="skapi.login(this); return false;">
        <input name="email" placeholder="E-Mail">
        <input name="password" placeholder="Password">
        <input type="submit" value="Login">
    </form>
</body>`;

</script>
<style scoped lang="less">
@import '@/assets/variables.less';

.updates {
    background: #F5F5F5;
    border-radius: 12px;

    line-height: 1.4;
    padding: .5em 0 .5em 2em;
    font-size: 16px;

    @media @tablet {
        font-size: 14px;
        padding: 4px 0 4px 1em;
    }

    &>h3 {
        color: var(--primary-color);

        &>span {
            // color: var(--font-color);
            opacity: .6;
            font-size: .5em;
            white-space: nowrap;
        }
    }
}

.how {
    margin-top: 44px;

    @media @tablet {
        margin-top: 28px;
    }

    &>* {
        display: block;
    }

    &>h3 {
        font-size: 20px;
    }

    .ex {
        background: #F5F5F5;
        border-radius: 12px;
        overflow-x: auto;

        &>pre {
            line-height: 1.4;
            padding: .5em 0 .5em 2em;
            font-size: 16px;

            @media @tablet {
                font-size: 14px;
                padding: 4px 0 4px 1em;
            }
        }
    }
}

.shell {
    width: 100%;
    --side-margins: 40px;

    @media @tablet {
        --side-margins: 16px;
    }

    @media @phone {
        --side-margins: 8px;
    }

    padding: 0 var(--side-margins);

    .landing-page {
        max-width: 1000px;
        margin: auto;

        .hero {
            .highlight {
                color: var(--primary-color);
            }
        }
    }
}


hr {
    height: 0px;
    margin-top: 44px;
    margin-bottom: 40px;
    border: none;
    box-shadow: 0px 1px 3px rgb(0 0 0 / 6%);
    border-top: 2px solid rgba(0, 0, 0, 0.06);
}

.hide_on_tablet {
    @media @tablet {
        display: none;
    }
}

h1 {
    font-weight: 700;
    font-size: 36px;
    line-height: 43.2px;
    white-space: break-spaces;

    @media @ipad {
        font-size: 28px;
    }
}

h2 {
    font-weight: 700;
    font-size: 32px;
    line-height: 38.4px;
    white-space: break-spaces;

    @media @ipad {
        font-size: 24px;
    }
}

h3 {
    font-weight: 700;
    font-size: 24px;
    line-height: 28.8px;

    @media @ipad {
        font-size: 24px;
    }

    white-space: break-spaces;
}

p {
    color: rgba(0, 0, 0, 0.6);
    font-weight: 500;
}

.hero {
    @media @ipad {
        margin-top: 50px;
    }

    margin-top: 100px;
    margin-bottom: 0;

    &+a {
        display: inline-block;
        margin-top: 72px;

        @media @ipad {
            margin-top: 48px;
        }
    }

    &>span {
        display: inline-block;
    }
}

.features {
    &>div:last-child {
        vertical-align: bottom;
        padding-right: 0px;
        padding-bottom: 1em;
    }

    &>div {
        width: 33.3%;

        @media @laptop {
            width: 50%;
        }

        @media @ipad {
            width: 100%;

            &:not(:last-child) {
                margin-top: 32px;
            }
        }

        margin-top: 44px;
        display: inline-block;
        vertical-align: top;
        padding-right: 62px;

        &>.title {
            .material-symbols-outlined {
                width: 40px;
                height: 40px;
                font-size: 38px;
            }

            &>* {
                display: inline-block;
            }

            h3 {
                line-height: 40px;
                margin: 0;
                vertical-align: middle;
            }
        }

        &>p {
            margin: 0;
            margin-top: 28px;
            font-size: 16px;
            font-weight: 500;
            line-height: 19.2px;

            &>span {
                display: inline-block;
            }
        }
    }
}
</style>
    