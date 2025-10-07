export type Tube = number[]
export type Move = [number, number]

export class LiquidSort {
  private _tubes: Tube[] = []
  private _moves: Move[] = []

  get tubes(): Tube[] {
    return this._tubes.map((tube) => [...tube])
  }
  get moves(): Move[] {
    return [...this._moves]
  }

  private readonly _tubesCount: number
  private readonly _tubeVolume: number
  private readonly _colorsCount: number

  get tubesCount(): number {
    return this._tubesCount
  }
  get tubeVolume(): number {
    return this._tubeVolume
  }
  get colorsCount(): number {
    return this._colorsCount
  }

  constructor(tubesCount: number, tubeVolume: number, colorsCount: number) {
    this._tubesCount = tubesCount
    this._tubeVolume = tubeVolume
    this._colorsCount = colorsCount

    this._tubes = this.generateTubes()
  }

  generateTubes(): Tube[] {
    const allColors: number[] = []
    for (let colorId = 0; colorId < this._colorsCount; colorId++) {
      for (let i = 0; i < this.tubeVolume; i++) {
        allColors.push(colorId)
      }
    }

    for (let currentIndex = allColors.length - 1; currentIndex > 0; currentIndex--) {
      const randomIndex = Math.floor(Math.random() * (currentIndex + 1))
      ;[allColors[currentIndex], allColors[randomIndex]] = [
        allColors[randomIndex]!,
        allColors[currentIndex]!,
      ]
    }

    const tubes: Tube[] = Array.from({ length: this._tubesCount }, () => [])
    for (let tubeIndex = 0; tubeIndex < this._colorsCount; tubeIndex++) {
      const start = tubeIndex * this.tubeVolume
      const end = start + this.tubeVolume
      tubes[tubeIndex] = allColors.slice(start, end)
    }

    return tubes
  }

  generateSolvedMoves(maxDepth = 100): Move[] | null {
    const seen = new Set<string>()
    const queue: { tubes: Tube[]; moves: Move[] }[] = [
      { tubes: this._tubes.map((t) => [...t]), moves: [] },
    ]

    const serialize = (tubes: Tube[]) => JSON.stringify(tubes)

    while (queue.length) {
      const { tubes: currentTubes, moves } = queue.shift()!
      const key = serialize(currentTubes)
      if (seen.has(key)) continue
      seen.add(key)

      if (this.checkTubesSolved(currentTubes)) {
        this._moves = moves
        return moves
      }
      if (moves.length >= maxDepth) continue

      for (let from = 0; from < currentTubes.length; from++) {
        for (let to = 0; to < currentTubes.length; to++) {
          if (from === to) continue
          const tubesCopy = currentTubes.map((tube) => [...tube])
          if (this.pourColor(tubesCopy, from, to)) {
            queue.push({ tubes: tubesCopy, moves: [...moves, [from, to]] })
          }
        }
      }
    }

    this._moves = []
    return null
  }

  // generateSolvedMoves() {
  //   type State = { tubes: Tube[]; moves: Move[] }
  //   const serialize = (tubes: Tube[]) => JSON.stringify(tubes)

  //   const visited = new Set<string>()
  //   const queue: State[] = [{ tubes: this._tubes.map((t) => [...t]), moves: [] }]

  //   while (queue.length) {
  //     const { tubes: currentTubes, moves } = queue.shift()!
  //     const key = serialize(currentTubes)
  //     if (visited.has(key)) continue
  //     visited.add(key)

  //     if (this.checkTubesSolved(currentTubes)) {
  //       this._moves = moves
  //       return
  //     }

  //     for (let from = 0; from < currentTubes.length; from++) {
  //       for (let to = 0; to < currentTubes.length; to++) {
  //         if (from === to) continue

  //         const tubesCopy = currentTubes.map((tube) => [...tube])
  //         if (this.pourColor(tubesCopy, from, to)) {
  //           queue.push({ tubes: tubesCopy, moves: [...moves, [from, to]] })
  //         }
  //       }
  //     }
  //   }

  //   this._moves = []
  // }

  pourColor(tubes: Tube[] = this._tubes, from: number, to: number): boolean {
    const sourceTube = tubes[from]
    const targetTube = tubes[to]

    if (!sourceTube || !sourceTube.length) return false
    if (!targetTube || targetTube.length >= this.tubeVolume) return false

    const targetColor = sourceTube[sourceTube.length - 1]!
    if (targetTube.length && targetTube[targetTube.length - 1] !== targetColor) return false

    let colorCount = 1
    for (let colorIndex = sourceTube.length - 2; colorIndex >= 0; colorIndex--) {
      if (sourceTube[colorIndex] === targetColor) colorCount++
      else break
    }

    const targetTubeEmptySpace = this.tubeVolume - targetTube.length
    const pourCount = Math.min(colorCount, targetTubeEmptySpace)

    for (let i = 0; i < pourCount; i++) {
      const color = sourceTube.pop()
      if (color !== undefined) targetTube.push(color)
    }

    return true
  }

  checkTubeSolved(tube: Tube): boolean {
    return (
      tube.length === 0 ||
      (tube.length === this?.tubeVolume && tube.every((color) => color === tube[0]))
    )
  }

  checkTubesSolved(tubes: Tube[] = this._tubes): boolean {
    return tubes.every(this.checkTubeSolved)
  }
}

export function generatePuzzle(tubesCount = 8, tubeVolume = 4, colorsCount = 6): Tube[] {
  const colors = [...Array(colorsCount).keys()]
  const allColors = [...Array(colorsCount).keys()].flatMap(() => colors)

  for (let currentIndex = allColors.length - 1; currentIndex > 0; currentIndex--) {
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1))
    ;[allColors[currentIndex], allColors[randomIndex]] = [
      allColors[randomIndex]!,
      allColors[currentIndex]!,
    ]
  }

  const tubes: Tube[] = [...Array(tubesCount).keys()].map(() => [])
  for (let tubeIndex = 0; tubeIndex < colorsCount; tubeIndex++) {
    const start = tubeIndex * tubeVolume
    const end = start + tubeVolume
    tubes[tubeIndex] = allColors.slice(start, end)
  }

  return tubes
}

export function checkSolved(tubes: Tube[], tubeVolume: number): boolean {
  return tubes.every(
    (tube) =>
      tube.length === 0 || (tube.length === tubeVolume && tube.every((color) => color === tube[0])),
  )
}

/** Переливание жидкости */
function pourColor(tubes: Tube[], from: number, to: number, V: number): boolean {
  const source: Tube | undefined = tubes[from]
  const target: Tube | undefined = tubes[to]

  if (!source || !source.length) return false
  if (!target || target.length >= V) return false

  const color = source[source.length - 1]!
  if (target.length > 0 && target[target.length - 1] !== color) return false

  let count = 1
  for (let i = source.length - 2; i >= 0; i--) {
    if (source[i] === color) count++
    else break
  }

  const space = V - target.length
  const pourCount = Math.min(count, space)

  for (let i = 0; i < pourCount; i++) {
    const drop = source.pop()
    if (drop) target.push(drop)
  }

  return true
}

/** Решатель BFS */
export function solve(tubes: Tube[], V: number, maxDepth = 100): Move[] | null {
  const seen = new Set<string>()
  const queue: { tubes: string; moves: Move[] }[] = [{ tubes: JSON.stringify(tubes), moves: [] }]

  while (queue.length) {
    const { tubes: stateStr, moves } = queue.shift()!
    const state: Tube[] = JSON.parse(stateStr)

    if (checkSolved(state, V)) return moves
    if (moves.length >= maxDepth) continue

    for (let from = 0; from < state.length; from++) {
      for (let to = 0; to < state.length; to++) {
        if (from === to) continue

        const newState: Tube[] = state.map((tube) => [...tube])
        if (pourColor(newState, from, to, V)) {
          const key = JSON.stringify(newState)
          if (!seen.has(key)) {
            seen.add(key)
            queue.push({ tubes: key, moves: [...moves, [from, to]] })
          }
        }
      }
    }
  }

  return null
}
