<template>
  <el-dialog
    v-model="visible"
    title="麦克风授权"
    width="422px"
    top="30vh"
    :modal="false"
    :before-close="handleBeforeClose"
  >
    <MicroChooser
      :max-option-height="120"
      class="micro-chooser"
      :switch-on="microOn"
      :option-list="microOptions"
      :selected-option-index="selectedMicroIndex"
      @choosed="onMicroChoosed"
      @clickIcon="onMicroIconClicked"
    />
    <p class="desc">
      点击下方按钮选择录制窗口
    </p>
    <button
      class="confirm-btn"
      @click="macroConfirm"
    >
      确定
    </button>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import MicroChooser from './creative/MicroChooser.vue'
import { MicroOption } from './videoTypes'

defineProps({
  visible: {
    type: Boolean,
    default: true,
  },
})

const prevMicroIndex = ref(0)
const prevMicroId = ref('')
const microOn = ref(true)
const microOptions = ref<MicroOption[]>([])
const selectedMicroIndex = ref(0)
const selectedMicroId = ref('')

onMounted(() => {
  loadCameraDeviceList()
})

const loadCameraDeviceList = () => {
  navigator.mediaDevices
    .enumerateDevices()
    .then(async (devices: MediaDeviceInfo[]) => {
      const audioDevices = []
      devices.forEach((device) => {
        if (device.kind === 'audioinput') {
          if (device.deviceId !== 'default') {
            audioDevices.push({
              id: device.deviceId,
              description: device.label,
            })
          }
        }
      })
      audioDevices.push({
        id: 'none',
        description: '无',
      })
      microOptions.value = audioDevices
      selectDefaultAudio(audioDevices)
    })
    .catch((err) => {
      console.log(err)
    })
}
const selectDefaultAudio = (audioDevices: MicroOption[]) => {
  let audioIndex = 0
  let audioId = audioDevices[0].id
  audioDevices.forEach((device, index) => {
    if (device.id.toLowerCase().indexOf('builtin') !== -1 || device.id.toLowerCase().indexOf('applehdaengineinput') !== -1
            || device.description.toLowerCase().indexOf('built-in') !== -1) {
      audioIndex = index
      audioId = device.id
    }
  })
  selectedMicroIndex.value = audioIndex
  selectedMicroId.value = audioId
}
const onMicroChoosed = (microIndex:number) => {
  selectedMicroIndex.value = microIndex
  selectedMicroId.value = microOptions.value[microIndex].id
  if (selectedMicroId.value !== 'none') {
    prevMicroIndex.value = microIndex
    prevMicroId.value = selectedMicroId.value
    microOn.value = true
  } else {
    microOn.value = false
  }
}
const onMicroIconClicked = () => {
  if (selectedMicroId.value === 'none') {
    selectedMicroIndex.value = prevMicroIndex.value
    selectedMicroId.value = microOptions.value[selectedMicroIndex.value].id
    microOn.value = true
  } else {
    selectedMicroIndex.value = microOptions.value.length - 1
    selectedMicroId.value = microOptions.value[selectedMicroIndex.value].id
    microOn.value = false
  }
}

const emit = defineEmits<{(e: 'macroSelectDialogVisibleChange'): void,
  (e: 'macroConfirm', val : { microId: string }): void,
}>()

const handleBeforeClose = () => {
  emit('macroSelectDialogVisibleChange')
}
const macroConfirm = () => {
  emit('macroConfirm', { microId: selectedMicroId.value })
}
</script>

<style scoped lang="scss">

.desc{
  margin-top: 20px;
  text-align: center;
  font-size: 12px;
  font-weight: 400;
  color: #666666;
}

.confirm-btn{
  width: 100%;
  height: 52px;
  background: #236CFB;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #FFFFFF;
  cursor: pointer;
  border: none;
}
</style>
