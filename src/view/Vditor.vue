<template>
  <div id="vditor" />
</template>

<script lang='ts' setup>
import { ref, onMounted } from 'vue';
import Vditor from 'vditor';
import 'vditor/dist/index.css';

const vditor = ref<Vditor | null>(null);

onMounted(() => {
  vditor.value = new Vditor('vditor', {
    mode: 'wysiwyg',
    typewriterMode: true,
    after: () => {
      vditor.value!.setValue('测试12');
    },
  });
});
</script>

<style scoped lang='scss'>
#vditor{
  width: 100%;
  height: 100vh !important;
}
</style>
