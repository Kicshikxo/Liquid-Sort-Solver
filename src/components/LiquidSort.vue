<template>
  <div class="puzzle">
    <div class="tubes">
      <div
        v-for="(tube, tubeIndex) in currentHistoryState"
        :key="tubeIndex"
        :class="['tube', { 'tube--solved': liquidSortSolver.checkTubeSolved(tube) }]"
      >
        <div
          v-for="(color, colorIndex) in [...tube].reverse()"
          :key="colorIndex"
          class="tube-color"
          :style="{
            backgroundColor:
              colorMap[color ?? Math.floor(Math.random() * Object.keys(colorMap).length)] || '#ccc',
          }"
        />
      </div>
    </div>

    {{ currentHistoryIndex }}
    <button @click="previousHistoryState" :disabled="currentHistoryIndex === 0">
      Предыдущий ход
    </button>
    <button @click="nextHistoryState" :disabled="solutionShown">Следующий ход</button>
    <p v-if="solutionShown">Решено за {{ liquidSortSolver.moves.length }} ходов</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { LiquidSortSolver } from '../assets/ts/liquid-sort-solver'
const props = withDefaults(
  defineProps<{
    tubesCount?: number
    tubeVolume?: number
    colorsCount?: number
  }>(),
  {
    tubesCount: 7,
    tubeVolume: 4,
    colorsCount: 5,
    // tubesCount: 14,
    // tubeVolume: 4,
    // colorsCount: 12,
  },
)

const liquidSortSolver = ref(
  new LiquidSortSolver(props.tubesCount, props.tubeVolume, props.colorsCount),
)

const tubesHistory = computed(() => liquidSortSolver.value.getTubesHistory())
const currentHistoryIndex = ref(0)
const currentHistoryState = computed(() => tubesHistory.value[currentHistoryIndex.value])

const solutionShown = computed(
  () => currentHistoryIndex.value === liquidSortSolver.value.moves.length,
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

onMounted(() => {
  console.time('generateRandomTubes')
  liquidSortSolver.value.generateRandomTubes()
  console.timeEnd('generateRandomTubes')
  console.log(liquidSortSolver.value.tubes)

  console.time('generateSolvedMoves')
  liquidSortSolver.value.generateSolvedMoves()
  console.timeEnd('generateSolvedMoves')
  console.log(liquidSortSolver.value.moves)
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
.puzzle {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
}

.tubes {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.tube {
  width: 40px;
  height: 160px;
  border: 2px solid #333;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: #eee;
  overflow: hidden;
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.2);
}
.tube--solver {
  background: red;
}

.tube-color {
  width: 100%;
  height: 25%;
  border-top: 1px solid rgba(0, 0, 0, 0.25);
  transition: background 0.3s;
}
</style>
