<template>
  <main class="main">
    <section class="page">
      <form ref="form" class="form" @submit.prevent="onSubmit">
        <div class="input__field">
          <label for="city">Количество пробирок (N)</label>
          <input
            class="input"
            type="number"
            name="tubes-count"
            placeholder="Введите количество пробирок"
            required
          />
        </div>
        <div class="input__field">
          <label for="city">Объём пробирки (V)</label>
          <input
            class="input"
            type="number"
            name="tube-volume"
            placeholder="Введите объём пробирки"
            required
          />
        </div>
        <div class="input__field">
          <label for="city">Количество цветов (M)</label>
          <input
            class="input"
            type="number"
            name="color-count"
            placeholder="Введите количество цветов"
            required
          />
        </div>
        <button class="button" type="submit">Сгенерировать</button>
      </form>

      <LiquidSort :tubes-count="tubesCount" :tube-volume="tubeVolume" :color-count="colorCount" />
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LiquidSort from './components/LiquidSort.vue'

const form = ref<HTMLFormElement | undefined>()

const tubesCount = ref(0)
const tubeVolume = ref(0)
const colorCount = ref(0)

function onSubmit() {
  const formData = new FormData(form.value)

  tubesCount.value = Number(formData.get('tubes-count'))
  tubeVolume.value = Number(formData.get('tube-volume'))
  colorCount.value = Number(formData.get('color-count'))
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
  padding: 16px;
}
</style>
