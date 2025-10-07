<template>
  <div class="puzzle">
    <div class="tubes">
      <div
        v-for="(tube, tubeIndex) in liquidSort.tubes"
        :key="tubeIndex"
        :class="['tube', { 'tube--solved': liquidSort.checkTubeSolved(tube) }]"
      >
        <div
          v-for="(drop, dropIndex) in [...tube].reverse()"
          :key="dropIndex"
          class="drop"
          :style="{ backgroundColor: colorMap[drop] || '#ccc' }"
        />
      </div>
    </div>

    <button @click="step" :disabled="solutionShown">Следующий ход</button>
    <p v-if="solutionShown">Решено за {{ liquidSort.moves.length }} ходов</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { LiquidSort } from '../assets/ts/liquid-sort'
const props = withDefaults(
  defineProps<{
    tubesCount?: number
    tubeVolume?: number
    colorsCount?: number
  }>(),
  {
    tubesCount: 8,
    tubeVolume: 4,
    colorsCount: 6,
  },
)

const liquidSort = new LiquidSort(props.tubesCount, props.tubeVolume, props.colorsCount)

// const N = 8
// const V = 4
// const M = 6

// const tubes = ref<Tube[]>([])
// const moves = ref<Move[]>([])
const currentMove = ref(0)
// const solved = ref(false)

const solutionShown = computed(() => currentMove.value === liquidSort.moves.length)

const colorMap: Record<string, string> = {
  0: 'var(--color-red-300)',
  1: 'var(--color-blue-300)',
  2: 'var(--color-green-300)',
  3: 'var(--color-orange-300)',
  4: 'var(--color-purple-300)',
  5: 'var(--color-cyan-300)',
  6: 'var(--color-pink-300)',
  7: 'var(--color-lime-300)',
}

onMounted(() => {
  console.time('generatePuzzle')
  liquidSort.generateTubes()
  // tubes.value = generatePuzzle(props.tubesCount, props.tubeVolume, props.colorsCount)
  console.timeEnd('generatePuzzle')
  console.log(liquidSort.tubes)
  console.time('solve')
  // liquidSort.generateSolvedMoves()
  // const result = solve(tubes.value, V, 150)
  console.timeEnd('solve')
  console.log(liquidSort.moves)
  // moves.value = result ?? []
})

function step(): void {
  const move = liquidSort.moves[currentMove.value]
  if (!move) {
    return
  }

  const [source, target] = move
  const sourceTube = liquidSort.tubes[source]
  const targetTube = liquidSort.tubes[target]

  if (!sourceTube?.length || !targetTube) return

  const targetColor = sourceTube.at(-1)
  if (!targetColor) return

  while (
    sourceTube.length &&
    sourceTube.at(-1) === targetColor &&
    targetTube.length < liquidSort.tubeVolume
  ) {
    const color = sourceTube.pop()
    if (color) targetTube.push(color)
  }

  currentMove.value++
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

.drop {
  width: 100%;
  height: 25%;
  border-top: 1px solid rgba(0, 0, 0, 0.25);
  transition: background 0.3s;
}
</style>
