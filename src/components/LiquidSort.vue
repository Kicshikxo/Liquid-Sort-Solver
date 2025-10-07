<template>
  <div v-if="tubesHistory.length" class="liquid-sort">
    <div class="container">
      <div class="tubes">
        <div class="tube-wrapper" v-for="(tube, tubeIndex) in currentHistoryState" :key="tubeIndex">
          <div
            :class="['tube-cap',{'tube-cap--visible':!tube.some((color: number | null) => color === null) && liquidSortSolver.checkTubeSolved(tube),}]"
          ></div>
          <div class="tube">
            <div
              v-for="(color, colorIndex) in [...tube].reverse()"
              :key="colorIndex"
              class="tube-color"
              :style="{
            backgroundColor: colorMap[color!] || 'var(--color-gray-200)',
          }"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div>
        Текущий шаг:
        <input
          v-model="currentHistoryIndex"
          :max="tubesHistory.length - 1"
          class="input"
          type="number"
        />
      </div>
      <div style="display: flex; gap: 16px">
        <button class="button" @click="previousHistoryState" :disabled="currentHistoryIndex === 0">
          Предыдущий шаг
        </button>
        <button
          class="button"
          @click="nextHistoryState"
          :disabled="currentHistoryIndex >= tubesHistory.length || tubesHistory.length <= 1"
        >
          Следующий шаг
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { LiquidSortSolver } from '../assets/ts/liquid-sort-solver'

const props = defineProps<{
  tubesCount: number
  tubeVolume: number
  colorCount: number
}>()

const liquidSortSolver = ref(
  new LiquidSortSolver(props.tubesCount, props.tubeVolume, props.colorCount),
)

const tubesHistory = computed(() => liquidSortSolver.value.getTubesHistory())
const currentHistoryIndex = ref(0)
const currentHistoryState = computed(
  () =>
    tubesHistory.value[
      Math.max(0, Math.min(currentHistoryIndex.value, tubesHistory.value.length - 1))
    ],
)

const colorMap: Record<string, string> = {
  0: 'var(--color-red-400)',
  1: 'var(--color-green-400)',
  2: 'var(--color-blue-400)',
  3: 'var(--color-orange-400)',
  4: 'var(--color-purple-400)',
  5: 'var(--color-cyan-400)',
  6: 'var(--color-pink-400)',
  7: 'var(--color-lime-400)',
  8: 'var(--color-amber-400)',
  9: 'var(--color-yellow-400)',
  10: 'var(--color-emerald-400)',
  11: 'var(--color-teal-400)',
  12: 'var(--color-cyan-400)',
  13: 'var(--color-sky-400)',
  14: 'var(--color-indigo-400)',
  15: 'var(--color-violet-400)',
  16: 'var(--color-violet-400)',
  17: 'var(--color-fuchsia-400)',
  18: 'var(--color-pink-400)',
  19: 'var(--color-rose-400)',
  20: 'var(--color-slate-400)',
  21: 'var(--color-gray-400)',
  22: 'var(--color-zinc-400)',
  23: 'var(--color-neutral-400)',
  24: 'var(--color-stone-400)',
}

function generateRandomTubes() {
  currentHistoryIndex.value = 0

  liquidSortSolver.value = new LiquidSortSolver(
    props.tubesCount,
    props.tubeVolume,
    props.colorCount,
  )

  console.time('generateRandomTubes')
  liquidSortSolver.value.generateRandomTubes()
  console.timeEnd('generateRandomTubes')
  console.log(liquidSortSolver.value.tubes)

  console.time('generateSolvedMoves')
  liquidSortSolver.value.generateSolvedMoves()
  console.timeEnd('generateSolvedMoves')
  console.log(liquidSortSolver.value.moves)
}

defineExpose({
  generateRandomTubes,
})

function previousHistoryState() {
  if (currentHistoryIndex.value > 0) {
    currentHistoryIndex.value--
  }
}
function nextHistoryState() {
  if (currentHistoryIndex.value < tubesHistory.value.length - 1) {
    currentHistoryIndex.value++
  }
}
</script>

<style scoped>
.liquid-sort {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
  gap: 16px;
}

.tubes {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
}

.tube-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.tube-cap {
  display: none;
  position: absolute;
  width: 100%;
  height: 20px;
  background-color: var(--color-amber-600);
  transform: translateY(-5px);
  clip-path: polygon(10% 0%, 90% 0%, 80% 100%, 20% 100%);
  border-radius: 10px 10px 0 0;
  z-index: 1;
}
.tube-cap--visible {
  display: block;
}
.tube {
  width: 40px;
  height: 180px;
  padding-top: 20px;
  border-radius: 0 0 10px 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: var(--color-gray-200);
  overflow: hidden;
  clip-path: polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%);
}

.tube-color {
  flex: 1;
  border-top: 1px solid rgba(0, 0, 0, 0.25);
  transition: background-color 0.3s;
}
</style>
