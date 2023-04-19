<template lang="pug">
section.sectionBox
    .overflow
        .helloSkapi
            .helloCont
                img.logoImg(src="@/assets/img/icons/Skapi_logo.svg")
                .tit
                    .withImg 
                        img.icon1(src="@/assets/img/icons/Asset5.svg")
                        em Empower
                        img.icon2(src="@/assets/img/icons/Asset4.svg")
                        img.icon3(src="@/assets/img/icons/Asset3.svg")
                        img.icon4(src="@/assets/img/icons/Asset2.svg")
                    .withImg 
                        img.icon5(src="@/assets/img/icons/Asset8.svg")
                        em Your Website with 
                        img.icon6(src="@/assets/img/icons/Asset7.svg")
                        img.icon7(src="@/assets/img/icons/Asset3.svg")
                    .withBtn
                        span A Robust Backend API
                        a(href='https://docs.skapi.com' target="_blank")
                            button GET STARTED
                                img(src="@/assets/img/icons/Asset9.svg")
                    .arrowImg 
                        img(src="@/assets/img/icons/Asset1.svg")
                h3 Welcome to Skapi
                p 
                    | "A robust and easy-to-use API service designed 
                    span to help developers build faster, more efficient, and scalable applications 
                    | . Our platform offers a suite of advanced tools and features, allowing you to streamline your development process and focus on what matters most: 
                    span creating incredible user experiences
                    | ."
                a(href='https://docs.skapi.com' target="_blank")
                    button.readBtn Read Document

section.sectionBox.showVideo
    .videoCont 
        img(src="@/assets/img/icons/video.svg")
section.sectionBox.features
    .feaCont 
        .cardTit
            h3 Key Features
        .cardWrap
            .cardInner
                .card
                    .icon
                        img(src="@/assets/img/icons/Asset21.svg")
                    .right
                        h4.tit Serverless Architecture
                        p.cont Embrace the simplicity of skapi's 100% serverless architecture. Say goodbye to dealing with terminals, installing frameworks on your machine, or worrying about scalability. With skapi, you can focus on building incredible web services without the hassle.
                .card
                    .icon
                        img(src="@/assets/img/icons/Asset14.png")
                    .right
                        h4.tit Database
                        p.cont Experience the power of an auto-indexed, scalable database that combines the best of relational and NoSQL architectures. skapi's innovative database solution ensures optimal performance and flexibility for your web services.
                .card
                    .icon
                        img(src="@/assets/img/icons/Asset15.png")
                    .right 
                        h4.tit Authentication
                        p.cont Take advantage of unlimited, pay-as-you-go cloud storage with skapi. Whether it's web hosting or serving large files with security restrictions, our platform provides the flexibility and reliability you need to manage your digital assets.
                .card
                    .icon
                        img(src="@/assets/img/icons/Asset16.png")
                    .right
                        h4.tit Cloud Storage
                        p.cont Take advantage of unlimited, pay-as-you-go cloud storage with skapi. Whether it's web hosting or serving large files with security restrictions, our platform provides the flexibility and reliability you need to manage your digital assets.
section.sectionBox.getStart
    .startCont 
        h3 Getting Started
        .levelWrap 
            .levelBar 
                .lb.lb1 
                    .num 01
                    .dot
                .lb.lb2
                    .num 02
                    .dot
                .lb.lb3 
                    .num 03
                    .dot
            .levelInner
                .level.lv1
                    .lvCont
                        .lvTit Create Service
                        .lvDesc Log and Create new Service from your dashboard 
                    .lvImg 
                        img(src="@/assets/img/icons/lvImg1.png")
                .level.lv2
                    .lvCont
                        .lvTit Retrieve ID
                        .lvDesc Retrieve the service ID and the owner’s ID from the dashboard
                    .lvImg 
                        img(src="@/assets/img/icons/lvImg2.png")
                .level.lv3
                    .lvCont
                        .lvTit Initialize Skapi
                        .lvDesc
                            | Import and Initialize Skapi from index.html. Replace
                            br
                            em ‘SERVICE_ID’ 
                            | and 
                            br
                            em ‘OWNERS_ID’ 
                            | with appropriate value.
                    .lvImg
                        .codeCopy(@click="codeCopy")
                            img(src="@/assets/img/icons/copy.svg")
                        .preCode
                            pre
                                code 
                                    |&lt;!DOCTYPE html&gt;
                                    |  &lt;head&gt;
                                    |    &lt;script src="https://cdn.jsdelivr.net/npm/skapi-js@latest/dist/skapi.js"&gt;&lt;/script&gt;
                                    |  &lt;/head&gt;
                                    |  &lt;script&gt;
                                    |    let skapi = new Skapi('
                                    span SERVICE_ID
                                    | ', '
                                    span OWNERS_ID
                                    | ');
                                    |  &lt;/script&gt;
section.sectionBox.trySkapi
    .tryCont 
        h3 DON’T JUST TAKE OUR WORD FOR IT
        h2 Ready to try Skapi?
        a(href='https://docs.skapi.com' target="_blank")
            button.startBtn Get Started
</template>

<script setup>
import { onMounted } from 'vue';

let currentScroll = 0;

function codeCopy() {
    let doc = document.createElement('textarea');
    doc.textContent = document.querySelector('.preCode pre code').textContent;
    document.body.append(doc);
    doc.select();
    document.execCommand('copy');
    doc.remove();

    alert('소스가 저장되었습니다. 붙여넣기 하시면 됩니다.');
}

onMounted(() => {
    function Mobile() { return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent); }
    if (Mobile()) {
        console.log('mobile')
        let cards = document.querySelectorAll('.card');
        
        cards.forEach((card) => {
            let cardTit = document.querySelector('.card .right .tit');
            let cardCont = document.querySelector('.card .right .cont');
            
            card.insertBefore(cardTit, null);
            card.insertBefore(cardCont, null);
        })

        let cardRight = document.querySelectorAll('.card .right');
        cardRight.forEach((right) => {
            right.remove();
        })

        let getStart = document.querySelector('.getStart');
        let lvImg3 = document.querySelector('.lv3 .lvImg');
        getStart.insertBefore(lvImg3, null);

        window.addEventListener('scroll', () => {
            currentScroll = window.scrollY + (window.innerHeight / 1.3);
    
            document.querySelectorAll('.lb').forEach((lb) => {
                let num = lb.querySelector(".num");
                let dot = lb.querySelector(".dot");
    
                if (currentScroll >= lb.offsetTop) {
                    num.classList.add('active');
                    dot.classList.add('active');
                } else {
                    num.classList.remove('active');
                    dot.classList.remove('active');
                }
            })
        })
    } else {
        console.log('pc')
        let features = document.querySelector('.features');
        let featuresTop = features.offsetTop;
        let cardWrap = document.querySelector('.cardWrap');
    
        window.addEventListener('scroll', () => {
            currentScroll = window.scrollY + (window.innerHeight / 2);

            let moveSpeed = -(currentScroll - featuresTop);
    
            if (currentScroll >= featuresTop) {
                cardWrap.style.left = moveSpeed + "px";
            } else {
                cardWrap.style.left = 0;
            }
    
            document.querySelectorAll('.lb').forEach((lb) => {
                let num = lb.querySelector(".num");
                let dot = lb.querySelector(".dot");
    
                if (currentScroll >= lb.offsetTop) {
                    num.classList.add('active');
                    dot.classList.add('active');
                } else {
                    num.classList.remove('active');
                    dot.classList.remove('active');
                }
            })
        })
    }

})
</script>

<style lang="less">
main {
    max-width: unset !important;
    margin: unset !important;
    padding: unset !important;
    box-sizing: unset !important;
    height: 100%;
    overflow-x: hidden;
    background-color: #f5f5f5;


    .sectionBox {
        .overflow {
            width: 100vw;
            overflow: hidden;
            position: relative;

            &::before {
                position: absolute;
                content: '';
                top: 545px;
                left: 50%;
                transform: translateX(-48%);
                width: 2024px;
                height: 440px;
                background: url(@/assets/img/icons/Asset10.svg) no-repeat;
            }

            .helloSkapi {
                width: 1024px;
                margin: 0 auto;

                .helloCont {
                    position: relative;
                    text-align: center;

                    .logoImg {
                        width: 20rem;
                        margin-top: 110px;
                    }

                    .tit {
                        position: relative;
                        font-size: 52px;
                        font-weight: 700;
                        margin: 35px 0 100px 0;
                        color: #262626;

                        .withImg {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-bottom: 10px;

                            em {
                                padding: 0 25px;
                                font-style: normal;
                            }

                            img {
                                &.icon1 {
                                    width: 74px;
                                }

                                &.icon2 {
                                    width: 82px;
                                    padding-right: 30px;
                                }

                                &.icon3 {
                                    width: 80px;
                                    padding-right: 20px;
                                }

                                &.icon4 {
                                    width: 139px;
                                    margin-top: 8px;
                                }

                                &.icon5 {
                                    width: 99px;
                                }

                                &.icon6 {
                                    width: 131px;
                                }

                                &.icon7 {
                                    display: none;
                                }
                            }
                        }

                        .withBtn {
                            display: flex;
                            align-items: center;
                            justify-content: center;

                            span {
                                height: 70px;
                                line-height: 70px;
                                background: linear-gradient(183.26deg, #FAFF00 2.7%, rgba(255, 230, 0, 0) 94.99%);
                            }

                            button {
                                width: 355px;
                                height: 70px;
                                border: 0;
                                outline: 0;
                                font-size: 20px;
                                font-weight: 700;
                                margin-left: 21px;
                                padding-left: 32px;
                                background: url(@/assets/img/icons/Asset6.svg) no-repeat;
                                background-size: cover;
                                color: #fff;
                                display: flex;
                                align-items: center;
                                cursor: pointer;

                                img {
                                    width: 40px;
                                    padding-left: 20px;
                                }
                            }
                        }

                        .arrowImg {
                            position: absolute;
                            right: 25px;
                            bottom: 10px;
                            width: 94px;
                            transform: rotate(-15deg);
                        }
                    }

                    h3 {
                        font-size: 32px;
                        font-weight: 700;
                        margin: 0;
                        margin-bottom: 28px;
                    }

                    p {
                        position: relative;
                        font-size: 20px;
                        font-weight: 500;
                        margin: 0;
                        color: #262626;

                        span {
                            color: #293FE6;
                        }
                    }

                    a {
                        text-decoration: none;

                        .readBtn {
                            position: relative;
                            width: 180px;
                            height: 40px;
                            font-weight: 700;
                            font-size: 16px;
                            margin: 70px 0 90px 0;
                            color: #fff;
                            background: #293FE6;
                            border: 0.5px solid #8C8C8C;
                            box-shadow: inset -1px -1px 2px rgba(0, 0, 0, 0.25), inset 1px 1px 2px rgba(255, 255, 255, 0.65);
                            border-radius: 4px;
                            cursor: pointer;
                        }
                    }
                }
            }
        }

        &.showVideo {
            position: relative;
            width: 1024px;
            height: 500px;
            margin: 100px auto;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        &.features {
            width: 100vw;
            overflow: hidden;
            margin-bottom: 100px;
            
            .feaCont {
                position: relative;
                width: 1024px;
                height: 500px;
                margin: 0 auto;

                .cardTit {
                    font-size: 32px;
                    font-weight: 700;

                    h3 {
                        margin: 0;
                        margin-bottom: 40px;
                    }
                }

                .cardWrap {
                    position: absolute;
                    left: 0;
                    height: 290px;

                    .cardInner {
                        width: 100%;
                        display: flex;
                        flex-wrap: nowrap;
                        
                        .card {
                            width: 460px;
                            height: 280px;
                            background: #fafafa;
                            box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
                            border-radius: 8px;
                            margin-right: 40px;
                            padding-right: 24px;
                            display: flex;
                            flex-wrap: nowrap;
                            
                            &:first-child {
                                .icon {
                                    img {
                                        width: 103px;
                                    }
                                }
                            }
                            &:nth-child(2) {
                                .icon {
                                    img {
                                        width: 72px;
                                    }
                                }
                            }
                            &:nth-child(3) {
                                .icon {
                                    img {
                                        width: 86px;
                                    }
                                }
                            }
                            &:last-child {
                                margin-right: 0;
    
                                .icon {
                                    img {
                                        width: 122px;
                                    }
                                }
                            }
                            .icon {
                                width: 30%;
                                padding: 0 30px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            }
                            .right {
                                width: 70%;

                                .tit {
                                    font-size: 20px;
                                    font-weight: 700;
                                    margin: 0;
                                    padding: 40px 0 18px 0;
                                }
                                .cont {
                                    font-size: 14px;
                                    font-weight: 400;
                                    line-height: 24px;
                                    margin: 0;
                                }
                            }
                        }
                    }
                }
            }
        }

        &.getStart {
            width: 1024px;
            margin: 0 auto;

            .startCont {
                h3 {
                    font-size: 32px;
                    font-weight: 700;
                    margin: 0;
                }

                .levelWrap {
                    display: flex;
                    flex-wrap: nowrap;

                    .levelBar {
                        width: 20%;
                        margin-top: 40px;

                        .lb {
                            display: flex;
                            flex-wrap: nowrap;
                            justify-content: space-between;
                            margin-bottom: 255px;

                            .num {
                                width: 90px;
                                height: 90px;
                                border: 10px solid transparent;
                                border-radius: 50%;
                                background-image: linear-gradient(#fff, #fff);
                                background-origin: border-box;
                                background-clip: content-box, border-box;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 40px;
                                font-weight: 700;

                                &.active {
                                    background-image: linear-gradient(#fff, #fff),
                                        linear-gradient(to right, #001CE9 0%, #fff 100%);
                                }
                            }

                            .dot {
                                position: relative;
                                width: 30px;
                                height: 30px;
                                margin-top: 40px;
                                margin-right: 20px;

                                &::before {
                                    position: absolute;
                                    content: '';
                                    left: 50%;
                                    top: 15px;
                                    transform: translateX(-50%);
                                    width: 10px;
                                    height: 360px;
                                    background-color: #ddd;
                                }

                                &.active::before {
                                    background-image: linear-gradient(to bottom, #001CE9 0%, #5B8BFB 100%);
                                    animation: fadeInText 1s ease-out forwards;
                                }

                                @keyframes fadeInText {
                                    0% {
                                        opacity: 0;
                                    }

                                    100% {
                                        opacity: 1;
                                    }
                                }

                                &::after {
                                    position: absolute;
                                    content: '';
                                    left: 50%;
                                    transform: translateX(-50%);
                                    width: 30px;
                                    height: 30px;
                                    border-radius: 50%;
                                    background-color: #fff;
                                }

                                &.active::after {
                                    width: 30px;
                                    height: 30px;
                                    border: 10px solid transparent;
                                    border-radius: 50%;
                                    background-image: linear-gradient(to right, #001CE9 0%, #fff 100%),
                                        linear-gradient(#fff, #fff);
                                    background-origin: border-box;
                                    background-clip: content-box, border-box;
                                    animation: fadeInText 0.1s ease-out forwards;
                                }
                            }

                            &.lb2 {
                                .dot {
                                    margin-top: 35px;

                                    &.active::before {
                                        background-image: linear-gradient(to bottom, #5B8BFB 0%, #fff 100%);
                                        animation: fadeInText 1s ease-out forwards;
                                    }
                                }
                            }

                            &.lb3 {
                                .dot::before {
                                    display: none;
                                }
                            }
                        }
                    }

                    .levelInner {
                        width: 80%;
                        margin-top: 70px;

                        .level {
                            display: flex;
                            flex-wrap: nowrap;
                            justify-content: space-between;
                            height: 300px;
                            margin-bottom: 58px;

                            &.lv2 {
                                margin-bottom: 72px;
                            }

                            &.lv3 {
                                margin-bottom: 0;
                            }

                            .lvCont {
                                width: 260px;
                                margin-left: 20px;
                                box-sizing: border-box;

                                .lvTit {
                                    font-size: 24px;
                                    font-weight: 700;
                                    margin: 10px 0 20px 0;
                                }

                                .lvDesc {
                                    font-size: 16px;
                                    font-weight: 400;
                                    line-height: 24px;

                                    em {
                                        color: #293FE6;
                                    }
                                }
                            }

                            .lvImg {
                                position: relative;
                                width: 512px;
                                box-sizing: border-box;

                                .preCode {
                                    position: relative;
                                    height: 234px;
                                    background-color: #434343;
                                    border-radius: 8px;
                                    color: #fff;
                                    overflow-x: auto;
                                    font-size: 16px;
                                    font-weight: 400;
                                    line-height: 24px;
                                    display: flex;
                                    align-items: center;
                                    padding: 0 28px;

                                    span {
                                        color: #7C8CFF;
                                    }
                                }

                                .codeCopy {
                                    position: absolute;
                                    right: 24px;
                                    top: 24px;
                                    width: 24px;
                                    height: 24px;
                                    z-index: 99;

                                    img {
                                        width: 24px;
                                        height: 24px;
                                        filter: invert(100%);
                                        cursor: pointer;
                                    }
                                }

                                img {
                                    width: 512px;
                                    height: 300px;
                                    object-position: top;
                                    border-radius: 8px;
                                }
                            }
                        }
                    }
                }
            }
        }

        &.trySkapi {
            width: 1024px;
            margin: 0 auto;
            padding: 10vw 0;
            text-align: center;
            font-weight: 700;

            h3 {
                font-size: 32px;
                margin: 0;
                margin-bottom: 20px;
            }

            h2 {
                font-size: 60px;
                color: #293FE6;
                margin: 0;
                margin-bottom: 40px;
            }

            .startBtn {
                position: relative;
                width: 180px;
                height: 40px;
                font-weight: 700;
                font-size: 16px;
                color: #fff;
                background: #293FE6;
                border: 0.5px solid #8C8C8C;
                box-shadow: inset -1px -1px 2px rgba(0, 0, 0, 0.25), inset 1px 1px 2px rgba(255, 255, 255, 0.65);
                border-radius: 4px;
                cursor: pointer;
            }
        }
    }
}

@media (max-width: 1024px) {
    main {
        -ms-overflow-style: none;
        scrollbar-width: none;
        &::-webkit-scrollbar {
            display: none;
        }

        .sectionBox {
            .overflow {
                width: 100%;

                .helloSkapi {
                    width: 100%;
                    
                    .helloCont {                        
                        .logo {
                            width: 30vw;
                        }
                        .tit {
                            font-size: 5vw;

                            .withImg {
                                img {
                                    &.icon1 {
                                        width: 7vw;
                                    }

                                    &.icon2 {
                                        width: 8vw;
                                        padding-right: 3vw;
                                    }

                                    &.icon3 {
                                        width: 8vw;
                                        padding-right: 2vw;
                                    }

                                    &.icon4 {
                                        width: 14vw;
                                    }

                                    &.icon5 {
                                        width: 10vw;
                                    }

                                    &.icon6 {
                                        width: 13vw;
                                    }

                                    &.icon7 {
                                        display: none;
                                    }
                                }
                            }

                            .withBtn {
                                button {
                                    width: 35vw;
                                }
                            }

                            .arrowImg {
                                right: 2vw;
                                width: 9vw;
                            }
                        }
                        p {
                            padding: 0 2vw;
                        }
                    }
                }
            }

            &.showVideo {
                width: 100%;
            }

            &.features {
                width: 100%;

                .feaCont {
                    .cardTit {
                        padding-left: 20px;
                    }
                }
            }

            &.getStart {
                width: 100%;
                height: 100%;
                padding: 10vw 0;
                box-sizing: border-box;
                
                .startCont {
                    padding: 0 20px;

                    .levelWrap {
                        .levelBar {
                            width: 20%;
                            margin-top: 40px;

                            .lb {
                                margin-bottom: 255px;
                                margin-bottom: 0;

                                .num {
                                    width: 8.9vw;
                                    height: 8.9vw;
                                    border: 1vw solid transparent;
                                    font-size: 4vw;
                                }

                                .dot {
                                    position: relative;
                                    width: 3vw;
                                    height: calc(30vw + 58px);
                                    margin-top: 3.5vw;
                                    margin-right: 2vw;

                                    &::before {
                                        width: 1vw;
                                        height: 110%;
                                    }

                                    &::after {
                                        width: 3vw;
                                        height: 3vw;
                                    }

                                    &.active::after {
                                        width: 3vw;
                                        height: 3vw;
                                        border: 1vw solid transparent;
                                    }
                                }
                            }
                        }
                        .levelInner {
                            .level {
                                height: 30vw;

                                .lvCont {
                                    width: 30%;
                                }

                                .lvImg {
                                    width: 70%;
                                    height: 30vw;
                                    overflow: hidden;
                                    border-radius: 8px;

                                    img {
                                        width: 100%;
                                        object-fit:cover;
                                        object-position: right top;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            &.trySkapi {
                width: 100%;
                padding: 100px 2px;

                h3 {
                    font-size: 20px;
                    margin-bottom: 12px;
                }

                h2 {
                    font-size: 32px;
                    margin-bottom: 48px;
                }

                .startBtn {
                    margin-bottom: 0;
                }
            }
        }
    }
}

@media (max-width: 650px) {
    main {
        -ms-overflow-style: none;
        scrollbar-width: none;
        &::-webkit-scrollbar {
            display: none;
        }

        .sectionBox {
            .overflow {
                .helloSkapi {
                    .helloCont {                        
                        .logo {
                            width: 200px;
                        }
                        .tit {
                            font-size: 32px;
                            margin: 30px 0 80px 0;
                            padding: 0 20px;

                            .withImg {
                                margin-bottom: 12px;

                                em {
                                    padding: 0 10px;
                                }

                                img {
                                    &.icon1 {
                                        width: 45px;
                                    }

                                    &.icon2 {
                                        width: 50px;
                                        padding-right: 10px;
                                    }

                                    &.icon3 {
                                        display: none;
                                    }

                                    &.icon4 {
                                        width: 96px;
                                    }

                                    &.icon5 {
                                        display: none;
                                    }

                                    &.icon6 {
                                        display: none;
                                    }

                                    &.icon7 {
                                        display: block;
                                        width: 11.5vw;
                                    }
                                }
                            }

                            .withBtn {
                                flex-wrap: wrap;

                                span {
                                    height: 40px;
                                    line-height: 40px;
                                    margin-bottom: 44px;
                                }

                                button {
                                    width: 256px;
                                    height: 46px;
                                    font-size: 16px;
                                    padding-left: 22px;

                                    img {
                                        width: 27px;
                                        padding-left: 40px;
                                    }
                                }
                            }

                            .arrowImg {
                                right: 6vw;
                                bottom: 5px;
                                width: 12vw;
                                transform: rotate(24deg);
                            }
                        }
                    }
                }
            }

            &.showVideo {
                width: 100%;
            }

            &.features {
                width: 100%;
            }

            &.getStart {
                width: 100%;
                height: 100%;
                
                .startCont {
                    padding: 0 20px;
                    box-sizing: border-box;
                    
                    h3 {
                        font-size: 28px;
                    }

                    .levelWrap {
                        display: flex;
                        flex-wrap: nowrap;
                        box-sizing: border-box;

                        .levelBar {
                            width: 23%;
                            margin-top: 40px;

                            .lb {
                                justify-content: center;
                                margin-bottom: 270px;

                                &.lb3 {
                                    margin-bottom: 0;
                                }

                                .num {
                                    position: relative;
                                    width: 60px;
                                    height: 60px;
                                    border: 0;
                                    font-size: 28px;
                                    font-weight: 700;

                                    &::before {
                                        position: absolute;
                                        content: '';
                                        left: 50%;
                                        top: 30px;
                                        transform: translateX(-50%);
                                        width: 10px;
                                        height: 300px;
                                        background-color: #ddd;
                                        z-index: 3;
                                    }
                                    &::after {
                                        position: absolute;
                                        content: '';
                                        width: 60px;
                                        height: 60px;
                                        border: 8px solid transparent;
                                        border-radius: 50%;
                                        background-image: linear-gradient(#fff, #fff);
                                        background-origin: border-box;
                                        background-clip: content-box, border-box;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        z-index: 9;
                                    }
                                    &.active::after {
                                        background-image: linear-gradient(#fff, #fff),
                                            linear-gradient(to right, #001CE9 0%, #fff 100%);
                                    }
                                }
                                &:first-child {
                                    .num {
                                        &.active::before {
                                            background-image: linear-gradient(to bottom, #001CE9 0%, #5B8BFB 100%);
                                            animation: fadeInText 1s ease-out forwards;
                                        }
                                        &::after {
                                            content: '01';  
                                        }
                                    }
                                }
                                &:nth-child(2) {
                                    .num {
                                        &.active::before {
                                            background-image: linear-gradient(to bottom, #5B8BFB 0%, #fff 100%);
                                            animation: fadeInText 1s ease-out forwards;
                                        }
                                        &::after {
                                            content: '02';  
                                        }
                                    }
                                }
                                &:last-child {
                                    .num {
                                        &::before {
                                            display: none;
                                        }
                                        &::after {
                                            content: '03';  
                                        }
                                    }
                                }

                                .dot {
                                    display: none;
                                }
                            }
                        }

                        .levelInner {
                            width: 75%;
                            margin-left: 2%;
                            margin-top: 57px;

                            .level {
                                flex-wrap: wrap;
                                justify-content: start;
                                height: 270px;

                                &.lv2 {
                                    padding-bottom: 61px;

                                    .lvImg {
                                        img {
                                            object-position: right top;
                                        }
                                    }
                                }
                                &.lv3 {
                                    height: auto;
                                    padding-bottom: 24px;

                                    .lvCont {
                                        .lvDesc {
                                            margin-bottom: 0;
                                        }
                                    }
                                    .lvImg {
                                        img {
                                            object-position: left top;
                                        }
                                    }
                                }

                                .lvCont {
                                    width: 100%;
                                    margin: 0;

                                    .lvTit {
                                        margin: 0;
                                        margin-bottom: 16px;
                                    }
                                    .lvDesc {
                                        margin-bottom: 16px;
                                    }
                                }

                                .lvImg {
                                    width: 100%;
                                    height: 160px;
                                    overflow: hidden;
                                    border-radius: 8px;
                                }
                            }
                        }
                    }
                }

                .lvImg {
                    position: relative;
                    width: 100%;

                    .preCode {
                        position: relative;
                        height: 234px;
                        background-color: #434343;
                        border-radius: 0;
                        color: #fff;
                        overflow: scroll;
                        font-size: 16px;
                        font-weight: 400;
                        line-height: 24px;
                        display: flex;
                        align-items: center;
                        padding: 0 20px;

                        span {
                            color: #7C8CFF;
                        }
                    }

                    .codeCopy {
                        position: absolute;
                        right: 24px;
                        top: 24px;
                        width: 24px;
                        height: 24px;
                        z-index: 99;

                        img {
                            width: 24px;
                            height: 24px;
                            filter: invert(100%);
                            cursor: pointer;
                        }
                    }

                    img {
                        width: 512px;
                        height: 300px;
                        object-fit: cover;
                        object-position: top;
                        border-radius: 8px;
                    }
                }
            }
        }
    }
}

@media (max-width: 450px) {
    main {
        -ms-overflow-style: none;
        scrollbar-width: none;
        &::-webkit-scrollbar {
            display: none;
        }

        .sectionBox {
            .overflow {
                &::before {
                    top: 450px;
                    transform: translateX(-53%);
                    width: 550px;
                    height: 122px;
                }

                .helloSkapi {
                    .helloCont {
                        text-align: left;
                        
                        .logo {
                            padding: 28px 20px 0 20px;
                            margin: 0;
                        }
                        .tit {
                            font-size: 8vw;
                            margin: 30px 0 80px 0;
                            padding: 0 20px;

                            .arrowImg {
                                right: 27px;
                                width: 45px;
                            }
                        }
                        h3 {
                            font-size: 28px;
                            margin-bottom: 16px;
                            padding: 20px;
                            padding-bottom: 0;
                        }

                        p {
                            padding: 16px 20px 0 20px;
                            background: linear-gradient(183.26deg, #FAFF00 2.7%, rgba(255, 230, 0, 0) 40%);
                        }

                        .readBtn {
                            margin: 28px 0 0 20px;
                        }
                    }
                }
            }

            &.showVideo {
                width: 100%;
                height: 100%;

                .videoCont {
                    img {
                        width: 100%;
                    }
                }
            }

            &.features {
                width: 100%;

                .feaCont {
                    width: 100%;
                    height: 100%;
                    padding: 0 20px;
                    box-sizing: border-box;

                    .cardTit {
                        width: 100%;
                        font-size: 28px;
                        padding-left: 0;

                        h3 {
                            margin-bottom: 28px;
                        }
                    }

                    .cardWrap {
                        position: relative;
                        height: 100%;

                        .cardInner {
                            width: 100%;
                            display: flex;
                            flex-wrap: wrap;
                            align-items: center;
                            justify-content: center;

                            &:last-child {
                                margin-bottom: 0;
                            }

                            .card {
                                width: 350px;
                                height: auto;
                                padding: 40px;
                                margin: 0;
                                margin-bottom: 28px;
                                flex-wrap: wrap;
                                align-items: center;
                                justify-content: space-between;
                                
                                &:first-child {
                                    .icon {
                                        img {
                                            width: 88px;
                                        }
                                    }
                                }
                                &:nth-child(2) {
                                    .icon {
                                        img {
                                            width: 65px;
                                        }
                                    }
                                    .cont {
                                        padding-top: 20px;
                                    }
                                }
                                &:nth-child(3) {
                                    .icon {
                                        img {
                                            width: 77px;
                                        }
                                    }
                                    .cont {
                                        padding-top: 20px;
                                    }
                                }
                                &:last-child {
                                    margin-right: 0;
        
                                    .icon {
                                        img {
                                            width: 106px;
                                        }
                                    }
                                }
                                .icon {
                                    width: 40%;
                                    padding: 0;
                                }
                                .tit {
                                    width: 55%;
                                    font-size: 20px;
                                    padding: 0;
                                }
                                .cont {
                                    width: 100%;
                                    font-size: 14px;
                                    font-weight: 400;
                                    line-height: 24px;
                                    margin: 0;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>