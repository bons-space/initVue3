<template>
  <div class="control">
    <div
      ref="iconRef"
      class="icon"
      @click="clickIcon"
    >
      <img
        v-if="switchOn"
        src="@/assets/video/microphone.svg"
        alt="microphone"
      >
      <img
        v-else
        src="@/assets/video/micro-off.svg"
        alt="micro-off"
      >
    </div>
    <div
      v-clickoutside="clickSelectOutside"
      class="select"
      :class="showOptions ? 'select-active' : ''"
      @click="showOptions = !showOptions"
    >
      <div class="title">
        {{ selectedMicro }}
      </div>
      <img
        class="arrow"
        src="@/assets/video/down-arrow.svg"
      >
      <div
        v-if="showOptions"
        class="option-list"
        :style="{ maxHeight: maxOptionHeight > 0 ? maxOptionHeight + 'px' : 'none', overflowY: maxOptionHeight > 0 ? 'scroll' : 'visible' }"
        @click.stop
      >
        <div
          v-for="(item, index) in optionList"
          :key="item.id"
          class="option-item"
          @click="clickOptionItem(index)"
        >
          <div>{{ item.description }}</div>
          <img
            v-if="index === selectedOptionIndex"
            src="@/assets/video/option-selected.svg"
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { PropType, ref, watch } from 'vue'
import { MicroOption } from '../videoTypes'

const props = defineProps(

  {
    switchOn: {
      type: Boolean,
      required: false,
      default: true,
    },
    optionList: {
      type: Array as PropType<MicroOption[]>,
      required: true,
      default: () => [],
    },
    selectedOptionIndex: {
      type: Number,
      required: true,
      default: 0,
    },
    maxOptionHeight: {
      type: Number,
      required: false,
      default: 0,
    },
  },
)
const showOptions = ref(false)
const selectedMicro = ref('')
const iconRef = ref<HTMLDivElement | null>(null)

watch(() => props.optionList, () => {
  selectedMicro.value = props.optionList[props.selectedOptionIndex] ? props.optionList[props.selectedOptionIndex].description : ''
})
watch(() => props.selectedOptionIndex, (val) => {
  selectedMicro.value = props.optionList[val] ? props.optionList[val].description : ''
})

const emit = defineEmits<{(e: 'clickIcon'): void,
  (e: 'choosed', option: number): void,
}>()

const clickIcon = () => {
  emit('clickIcon')
}
const clickSelectOutside = () => {
  showOptions.value = false
}
const clickOptionItem = (index:number) => {
  showOptions.value = false
  emit('choosed', index)
}
// const updateIconBg = (percent:number) => {
//   (iconRef.value as HTMLDivElement).style.backgroundSize = `100% ${percent}%`
// }
</script>
<style scoped lang="scss">
.control {
  display: flex;
  flex-direction: row;
  align-items: center;
  .icon {
    width: 38px;
    height: 38px;
    background: rgba(245,247,251,1);
    border: 1px solid rgba(216,216,216,1);
    border-radius: 8px;
    background-image: linear-gradient(0deg, rgba(35,108,251,0.26), rgba(35,108,251,0.26));
    background-size: 100% 0%;
    background-repeat: no-repeat;
    background-position: bottom;
    & img {
      width: 38px;
      height: 38px;
    }
  }
  .select {
    flex-grow: 1;
    margin-left: 8px;
    height: 38px;
    background: rgba(255,255,255,1);
    border: 1px solid rgba(216,216,216,1);
    border-radius: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    cursor: pointer;
    .title {
      flex-grow: 1;
      margin-left: 12px;
      margin-right: 12px;
      font-size: 14px;
      font-weight: 500;
      color: rgba(51,51,51,1);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 0;
    }
    .arrow {
      width: 12px;
      height: 6px;
      margin-right: 12px;
    }
    .option-list {
      z-index: 100;
      position: absolute;
      top: 39px;
      left: 0;
      right: 0;
      background: rgba(255,255,255,1);
      border: 1px solid rgba(216,216,216,1);
      border-radius: 8px;
      box-shadow:  0 4px 6px 0 rgba(139,139,139,0.4);
      padding: 6px 0;
      display: flex;
      flex-direction: column;
      .option-item {
        height: 38px;
        min-height: 38px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        & div {
          margin-left: 25px;
          font-size: 14px;
          font-weight: 500;
          color: rgba(51,51,51,1);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        & img {
          width: 38px;
          height: 38px;
        }
        &:hover {
          background: rgba(240,242,246,1);
        }
      }
    }
  }
  .select-active {
    border: 1px solid rgba(35,108,251,1);
  }
}
</style>
