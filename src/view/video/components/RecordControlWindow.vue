<template>
  <div
    class="control-out"
    :style="controlBoxShow || countDownShow? {} : {visibility: 'hidden', pointerEvents : 'none'}"
  >
    <div
      v-show="countDownShow"
      class="countDown"
    >
      {{ recordStartCountDown }}
    </div>
    <div
      v-show="controlBoxShow"
      class="control"
    >
      <div class="title">
        屏幕录制中…
      </div>
      <img
        class="screen"
        src="@/assets/video/screen.svg"
        alt="screen"
      >
      <div
        class="duration"
        :class="{ 'duration-red': recordStatus === 'paused', 'duration-small': recordStatus !== '' && recordDurationStr.length > 5 }"
      >
        {{ recordStatus === 'paused' ? '暂停' : recordDurationStr }}
      </div>
      <button
        class="stop-btn"
        @click="clickEndButton()"
      >
        停止录屏
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus';
import { formatDate, formatDuration } from '@/utils/date';

const props = defineProps({
  microId: {
    type: String,
    default: '',
  },
})

const controlBoxShow = ref(false)
const countDownShow = ref(false)
const recordStartCountDown = ref(0)
const recordStartCountDownTimer = ref<NodeJS.Timer | null>(null)
const recordStatus = ref('')
const recordStream = ref<MediaStream | null>(null)
const recordRecorder = ref<MediaRecorder | null>(null)
const recordStartTime = ref(0) // 录制开始时间
const recordInterval = ref<NodeJS.Timer | null>(null)
const recordDurationStr = ref('00:00')
const recordDocName = ref('')

onMounted(async () => {
  await initRecordStream()
  if (recordRecorder.value) {
    recordStartCountDown.value = 3
    recordStartCountDownTimer.value = setInterval(() => {
      if (recordStartCountDown.value <= 1) {
        startRecordRecorder()
        recordStartCountDownTimer.value && clearInterval(recordStartCountDownTimer.value)
        countDownShow.value = false
        controlBoxShow.value = true // 开始录屏
      } else {
        recordStartCountDown.value--
      }
    }, 1000)
  }
})

const emit = defineEmits(['recordWindowClose'])

const initRecordStream = async () => {
  let captureStream: MediaStream
  try {
    captureStream = await navigator.mediaDevices.getDisplayMedia({
      audio: false,
      video: {
        frameRate: 30, // 指定可接受和/或要求的帧速率或帧速率范围。
        width: 1920,
        height: 1080,
      },
    })
    captureStream.getVideoTracks()[0].onended = async () => {
      // 单击停止共享按钮后，触发这个事件
      await clickEndButton()
      recordStartCountDownTimer.value && clearInterval(recordStartCountDownTimer.value)
      if (recordStream.value != null) {
        recordStream.value.getTracks().forEach((track) => {
          track.stop()
        })
      }
      if (recordRecorder.value?.state && recordRecorder.value.state === 'inactive') {
        emit('recordWindowClose')
      }
    }
  } catch (err) {
    switch (`${err}`.split(':')[0]) {
      case 'AbortError':
        ElMessage.error('录制功能权限错误，请检查浏览器权限并重启浏览器后重试')
        break
      case 'InvalidStateError':
        ElMessage.error('当前上下文的DOM未完全激活，请检查浏览器权限并重启浏览器后重试')
        break
      case 'NotAllowedError':
        ElMessage.error('所选屏幕区域权限错误，请检查浏览器权限并重启浏览器后重试')
        break
      case 'NotFoundError':
        ElMessage.error('没有可用于捕获的屏幕视频源，请检查浏览器权限并重启浏览器后重试')
        break
      case 'NotReadableError':
        ElMessage.error('共享所选源被占用，请检查浏览器权限并重启浏览器后重试')
        break
      case 'OverconstrainedError':
        ElMessage.error('录制所选源无法兼容，请检查浏览器权限并重启浏览器后重试')
        break
      case 'TypeError':
        ElMessage.error('录制功能权限错误，请检查浏览器权限并重启浏览器后重试')
        break
      default:
        console.error(`Error: ${err}`)
    }
    emit('recordWindowClose')
    return
  }
  if (props.microId && props.microId !== 'none') {
    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: props.microId,
      },
      video: false,
    })
    audioStream.getAudioTracks().forEach((track) => {
      captureStream.addTrack(track)
    })
  }
  recordStream.value = captureStream
  await initRecordRecorder()
}

const initRecordRecorder = async () => {
  recordDocName.value = `录屏 ${formatDate(new Date(), 'yyyy.MM.dd hh:mm:ss')}`
  recordRecorder.value = new MediaRecorder(recordStream.value as MediaStream, {
    bitsPerSecond: 256 * 8 * 1024,
    audioBitsPerSecond: 256 * 8 * 1024,
    videoBitsPerSecond: 256 * 8 * 1024,
    mimeType: 'video/webm;codecs=vp9,opus',
  })
  countDownShow.value = true // 开始倒计时
  recordRecorder.value.onstart = onRecorderStart // 开始录屏
  recordRecorder.value.onpause = onRecorderPause // 暂停录屏
  recordRecorder.value.onresume = onRecorderResume // 重新开始录屏
  recordRecorder.value.onstop = onRecorderStop // 停止录屏
  recordRecorder.value.onerror = onRecorderError // 录屏出错
  recordRecorder.value.ondataavailable = onRecorderDataAvailable // 录制完成
}

const startRecordRecorder = () => {
  recordRecorder.value && recordRecorder.value.state === 'inactive' && recordRecorder.value.start(3000)
}

// 开始录屏
const onRecorderStart = () => {
  recordStatus.value = 'recording'

  recordStartTime.value = new Date().getTime();
  recordInterval.value = setInterval(() => {
    if (recordStatus.value === 'recording') {
      const ts = new Date().getTime()
      const time = ts - recordStartTime.value
      recordDurationStr.value = formatDuration(time)
      if (time >= 4 * 60 * 60 * 1000) {
        clickEndButton()
      }
    }
  }, 500)
}

// 暂停录屏
const onRecorderPause = () => {
  recordStatus.value = 'paused'
}

// 重新开始录屏
const onRecorderResume = () => {
  recordStatus.value = 'recording'
  recordStartTime.value = new Date().getTime()
}

// 停止录屏
const onRecorderStop = async () => {
  recordStatus.value = 'inactive'
  if (recordInterval.value) {
    clearInterval(recordInterval.value)
    recordInterval.value = null
  }
}

// 录屏出错
const onRecorderError = (err: Event) => {
  console.error(`录屏出错 Error: ${err}`)
  emit('recordWindowClose')
}

const recordChunks:any[] = []
// 录制结果
const onRecorderDataAvailable = (event: BlobEvent) => {
  recordChunks.push(event.data)
  if (recordRecorder.value && recordRecorder.value.state === 'inactive') {
    // TODO: 录制完成
    const download = () => {
      if (recordChunks.length > 0) {
        const name = `录屏测试-${new Date().getTime()}`
        const a = document.createElement('a')
        const blob = new Blob(recordChunks, { type: 'video/webm' })
        a.href = URL.createObjectURL(blob)
        a.download = `${name}.webm`
        document.body.appendChild(a)
        a.click()
      }
    }
    download()
  }
}

const clickEndButton = () => {
  recordRecorder.value && recordRecorder.value.state === 'recording' && recordRecorder.value.stop()
}

</script>

<style scoped lang="scss">
.control-out {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(238, 241, 249, 0.9);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;

  .countDown {
    width: 287px;
    height: 287px;
    background: #0070FF;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 200px;
    font-weight: 800;
    color: #FFFFFF;
    line-height: 300px;
  }

  .control {
    display: flex;
    width: 320px;
    flex-direction: column;
    align-items: center;
    padding: 34px 0;
    transition: all 200ms ease-in-out;
    background: #FFFFFF;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.16);
    border-radius: 8px;
    border: 1px solid #E0E0E0;

    .title {
      font-size: 16px;
      font-weight: 500;
      color: #333333;
      line-height: 16px;
    }

    .screen {
      width: 80px;
      height: 80px;
      margin-top: 34px;
    }

    .duration {
      height: 42px;
      font-size: 30px;
      font-weight: 500;
      color: #000000;
      line-height: 42px;
      margin-top: 34px;
    }

    .stop-btn {
      margin-top: 22px;
      width: 234px;
      height: 52px;
      background: #236CFB;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 500;
      color: #FFFFFF;
      cursor: pointer;
      border: none;
      outline: none;
    }
  }
}
</style>
