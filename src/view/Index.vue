
<template>
  <div>
    <button @click="onTestVideoClick">测试视频</button>
    <button @click="onTestDocClick">测试文章</button>
  </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue'
console.log(window)
console.log((window as any).MoYinSDK)
const { useDocIframe, useVideoIframe } = (window as any).MoYinSDK

const onTestVideoClick = () => {
  useVideoIframe('https://hcplayer.moyincloud.com/?vid=369618754813956096&websiteId=10000066&embedId=1547498886414815234', {
    phoneMatchMediaWidth: 900,
    dialogModal: {
      phoneBg: '#000',
      defaultBg: 'rgba(0, 0, 0, 0.8)',
    },
    dialog: {
      width: '80vw',
      maxWidth: '1200px',
      paddingTop: '62.50%',
    },
  })
}

const onTestDocClick = () => {
  useDocIframe('https://devhuoban.moyincloud.com/embed/1534743908534902786.html?websiteId=1000023&embedId=1546318994236731393', {
    dialogModal: {
      background: 'rgb(0, 0, 0, 0.6)',
    },
    dialog: {
      maxWidth: '1200px',
      top: '10vh',
      right: '10vw',
      background: '#fff',
    },
  })
}
</script>

<style scoped lang='scss'>
</style>
