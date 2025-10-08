<template>
  <main class="main">
    <section class="page">
      <form ref="form" class="form" @submit.prevent="onSubmit">
        <div class="input__field">
          <label for="tubes-count">Количество пробирок (N)</label>
          <input
            class="input"
            type="number"
            id="tubes-count"
            name="tubes-count"
            placeholder="Введите количество пробирок"
          />
        </div>
        <div class="input__field">
          <label for="tube-volume">Объём пробирки (V)</label>
          <input
            class="input"
            type="number"
            id="tube-volume"
            name="tube-volume"
            placeholder="Введите объём пробирки"
          />
        </div>
        <div class="input__field">
          <label for="color-count">Количество цветов (M)</label>
          <input
            class="input"
            type="number"
            id="color-count"
            name="color-count"
            placeholder="Введите количество цветов"
          />
        </div>
        <div
          class="input__field input__field--checkbox"
          title="Если включено - поиск займёт меньше времени, но решение потребует большего количества ходов. Рекомендуется для большого количества пробирок."
        >
          <input type="checkbox" id="fast-search" name="fast-search" checked />
          <label for="fast-search">Быстрый поиск</label>
        </div>
        <button class="button" type="submit">Сгенерировать</button>
      </form>

      <LiquidSort
        ref="liquidSort"
        :tubes-count="tubesCount"
        :tube-volume="tubeVolume"
        :color-count="colorCount"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'
import LiquidSort from './components/LiquidSort.vue'

const form = ref<HTMLFormElement | undefined>()
const liquidSort = ref<typeof LiquidSort | undefined>()

const tubesCount = ref(0)
const tubeVolume = ref(0)
const colorCount = ref(0)

function onSubmit() {
  const formData = new FormData(form.value)

  tubesCount.value = Number(formData.get('tubes-count'))
  tubeVolume.value = Number(formData.get('tube-volume'))
  colorCount.value = Number(formData.get('color-count'))
  const fastSearch = Boolean(formData.get('fast-search'))

  nextTick(() => liquidSort.value?.generateRandomTubes(fastSearch))
}
</script>

<style scoped>
.main {
  flex: 1;
  display: flex;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
}
.page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100%;
  position: absolute;
  padding: 16px 0;
}
</style>
