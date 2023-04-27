<template lang="pug">
.content_box
    .circle
        .box
    .background_box.b1 
        .background.c1
    .background_box.b2 
        .background.c2 
    .background_box.b3
        .background.c3 
    .background_box.b4
        .background.c4
</template>

<style lang="less" scoped>
.content_box {
    width: 20px;
    height: 20px;
    --bgColor: 41, 63, 230;
    --ringColor: 255, 255, 255;

    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    position: absolute;
    box-sizing: border-box;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background: rgba(var(--bgColor),1);
    border-radius: 50%;
    animation: rotateS .8s linear infinite;

    @keyframes rotateS {
        50% {
            transform: rotate(180deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }
    .circle {
        position: absolute;
        width: 2.5px;
        height: 50%;
        z-index: 2;
        transform-origin: 50% 100%;
        transform: rotate(0deg);

        .box {
            position: absolute;
            top: 0px;
            width: 2.5px;
            height: 2.5px;
            border-radius: 50%;
            background: rgba(var(--ringColor), 1);
        }
    }
    .background_box {
        position: relative;
        width: 50%;
        height: 50%;
        box-sizing: border-box;

        &.b1 {
            border-radius: 100% 0 0 0/ 100% 0 0 0;
            background: linear-gradient(rgba(var(--ringColor), 1), rgba(var(--ringColor), 0.8));
        }
        &.b2 {
            border-radius: 0 100% 0 0/ 0 100% 0 0;
            background: linear-gradient(transparent, transparent);
        }
        &.b3 {
            border-radius: 0 0 0 100%/ 0 0 0 100%;
            background: linear-gradient(rgba(var(--ringColor), 0.8), rgba(var(--ringColor), 0.4));
        }
        &.b4 {
            border-radius: 0 0 100% 0/ 0 0 100% 0;
            background: linear-gradient(transparent, rgba(var(--ringColor), 0.45));
        }
        .background {
            position: absolute;
            width: calc(100% - 2.5px);
            height: calc(100% - 2.5px);
            background: rgba(var(--bgColor),1);
            border: none;

            &.c1 {
                right: 0;
                bottom: 0;
                border-radius: 100% 0 0 0/ 100% 0 0 0;
            }
            &.c2 {
                left: 0;
                bottom: 0;
                border-radius: 0 100% 0 0/ 0 100% 0 0;
            }
            &.c3 {
                right: 0;
                top: 0;
                border-radius: 0 0 0 100%/ 0 0 0 100%;
            }
            &.c4 {
                left: 0;
                top: 0;
                border-radius: 0 0 100% 0/ 0 0 100% 0;
            }
        }
    }
}
</style>