<template>
  <div
    class="player"
  >
    <div
      class="video-area"
      :style="{ width: canvasDomWidth > 0 ? canvasDomWidth + 'px' : '', height: canvasDomHeight > 0 ? canvasDomHeight + 'px' : '' }"
    >
      <canvas
        ref="videoCanvasRef"
        :width="videoWidth"
        :height="videoHeight"
        :style="{ width: canvasDomWidth > 0 ? canvasDomWidth + 'px' : '', height: canvasDomHeight > 0 ? canvasDomHeight + 'px' : '' }"
      />
    </div>
    <div
      class="control"
      :style="{ width: canvasDomWidth > 0 ? canvasDomWidth + 'px' : '256px' }"
    >
      <div class="info">
        <span>0:00</span> / 6:57
      </div>
      <div class="play-button">
        <img src="@/assets/video/canvasPlayer/icon-play.svg">
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  watch, PropType, ref, onMounted,
} from 'vue'
import { TtsAudioItem } from '../components/audio/ttsAudioItem';

const props = defineProps({
  playerWidth: {
    type: Number,
    required: true,
    default: 0,
  },
  playerHeight: {
    type: Number,
    required: true,
    default: 0,
  },
  videoWidth: {
    type: Number,
    required: true,
    default: 0,
  },
  videoHeight: {
    type: Number,
    required: true,
    default: 0,
  },
  thumbnail: {
    type: String,
    default: '',
  },
  audioVoice: {
    type: Number,
    default: 0,
  },
  audioList: {
    type: Object as PropType<TtsAudioItem[]>,
    default() {
      return []
    },
  },
})

const videoCanvasRef = ref<HTMLCanvasElement | null>(null)
const canvasContext = ref<CanvasRenderingContext2D | null>(null)

watch(() => [props.playerWidth, props.playerHeight, props.videoWidth, props.videoHeight], (val) => {
  calcCanvasDomSize()
})

watch(() => props.thumbnail, (val) => {
  if (val) {
    const img = new Image()
    img.addEventListener('load', () => {
      (canvasContext.value as CanvasRenderingContext2D).clearRect(0, 0, props.videoWidth, props.videoHeight);
      (canvasContext.value as CanvasRenderingContext2D).drawImage(img, 0, 0)
    })
    img.src = val
  }
})

onMounted(() => {
  canvasContext.value = (videoCanvasRef.value as HTMLCanvasElement).getContext('2d')
})

const canvasDomWidth = ref(0)
const canvasDomHeight = ref(0)

const calcCanvasDomSize = () => {
  if (props.playerWidth > 0 && props.playerHeight > 0 && props.videoWidth > 0 && props.videoHeight > 0) {
    const playerHeight = props.playerHeight - 66
    if (props.playerWidth * props.videoHeight > props.videoWidth * playerHeight) {
      canvasDomHeight.value = playerHeight
      canvasDomWidth.value = props.videoWidth * playerHeight / props.videoHeight
    } else {
      canvasDomWidth.value = props.playerWidth
      canvasDomHeight.value = props.videoHeight * props.playerWidth / props.videoWidth
    }
  }
}

</script>
<style scoped lang="scss">
.player {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  .video-area {
    overflow: hidden;
    border-radius: 8px;
    box-sizing: border-box;
    border: 1px solid #D9DBE2;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    & canvas {
      max-width: 100%;
      max-height: 100%;
    }
  }
  .control {
    position: relative;
    display: flex;
    flex-direction: row;
    .info {
      margin-top: 20px;
      border-radius: 4px;
      background: #EAF0FD;
      padding: 2px 13px 1px 13px;
      font-size: 12px;
      font-weight: 500;
      line-height: 26px;
      letter-spacing: 0em;
      color: #3D3D3D;
      & span {
        color: #1F5FFF;
      }
    }
    .play-button {
      position: absolute;
      top: 10px;
      left: calc((100% - 56px) / 2);
      width: 56px;
      height: 56px;
      & img {
        width: 56px;
        height: 56px;
      }
    }
  }
}
</style>
