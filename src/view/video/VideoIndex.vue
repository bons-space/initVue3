<template>
  <div>
    <button @click="clickRecordButton">
      开始录屏
    </button>

    <MicroSelectDialog v-if="microSelectDialogVisible" :visible="microSelectDialogVisible"
      @macroSelectDialogVisibleChange="macroSelectDialogVisibleChange" @macroConfirm="macroConfirm" />
    <RecordControlWindow v-if="recordWindowVisible" :micro-id="microId"
      @recordWindowClose="recordWindowVisibleChange(false)" />
  </div>
</template>

<script lang='ts' setup>
import RecordControlWindow from './components/RecordControlWindow.vue'
import MicroSelectDialog from './components/MicroSelectDialog.vue'
import { ref } from 'vue';

const recordWindowVisible = ref(false)
const microSelectDialogVisible = ref(false)
const microId = ref('')

const clickRecordButton = () => {
  navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((res) => {
    res.getTracks().forEach((track) => {
      track.stop()
    })
    macroSelectDialogVisibleChange()
  })
}

const macroConfirm = (val: { microId: string }) => {
  macroSelectDialogVisibleChange()
  microId.value = val.microId
  recordWindowVisibleChange(true)
}

const macroSelectDialogVisibleChange = () => {
  microSelectDialogVisible.value = !microSelectDialogVisible.value
}

const recordWindowVisibleChange = (val: boolean) => {
  recordWindowVisible.value = val
}
</script>

<style scoped lang='scss'>
</style>
