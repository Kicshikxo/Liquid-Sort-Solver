export type Tube = (number | null)[]
export type Move = [number, number]

export class LiquidSortSolver {
  private _tubes: Tube[] = []
  private _moves: Move[] = []

  get tubes(): Tube[] {
    return this._tubes.map((tube) => [...tube])
  }
  get moves(): Move[] {
    return [...this._moves]
  }

  private readonly _tubeCount: number
  private readonly _tubeVolume: number
  private readonly _colorCount: number

  get tubeCount(): number {
    return this._tubeCount
  }
  get tubeVolume(): number {
    return this._tubeVolume
  }
  get colorCount(): number {
    return this._colorCount
  }

  constructor(tubesCount: number, tubeVolume: number, colorsCount: number) {
    this._tubeCount = tubesCount
    this._tubeVolume = tubeVolume
    this._colorCount = colorsCount
  }

  generateRandomTubes(): Tube[] {
    const colors = [...Array(this.colorCount).keys()]
    const allColors = [...Array(this.tubeVolume).keys()].flatMap(() => colors)

    for (let currentIndex = allColors.length - 1; currentIndex > 0; currentIndex--) {
      const randomIndex = Math.floor(Math.random() * (currentIndex + 1))
      ;[allColors[currentIndex], allColors[randomIndex]] = [
        allColors[randomIndex]!,
        allColors[currentIndex]!,
      ]
    }

    const tubes: Tube[] = Array.from({ length: this.tubeCount }, () =>
      Array(this.tubeVolume).fill(null),
    )
    for (let colorIndex = 0; colorIndex < this.colorCount; colorIndex++) {
      const start = colorIndex * this.tubeVolume
      const end = start + this.tubeVolume
      tubes[colorIndex] = allColors.slice(start, end)
    }

    this._tubes = tubes
    this._moves = []

    return tubes
  }

  public getTubeTopColor(tube: Tube): { color: number | null; index: number } {
    for (let colorIndex = tube.length - 1; colorIndex >= 0; colorIndex--) {
      if (tube[colorIndex] !== null) return { color: tube[colorIndex]!, index: colorIndex }
    }
    return { color: null, index: -1 }
  }

  public pourColor(tubes: Tube[] = this.tubes, source: number, target: number): boolean {
    const sourceTube = tubes[source]
    const targetTube = tubes[target]

    if (!sourceTube || !targetTube) return false

    const { color: sourceColor, index: sourceColorIndex } = this.getTubeTopColor(sourceTube)
    if (sourceColor === null) return false

    const { color: targetColor } = this.getTubeTopColor(targetTube)
    if (targetTube.filter((color) => color !== null).length > 0 && targetColor !== sourceColor)
      return false

    const targetTubeEmptySpace = targetTube.filter((color) => color === null).length
    let colorCount = 1
    for (let colorIndex = sourceColorIndex - 1; colorIndex >= 0; colorIndex--) {
      if (sourceTube[colorIndex] === sourceColor) colorCount++
      else break
    }

    const pourCount = Math.min(colorCount, targetTubeEmptySpace)
    if (pourCount === 0) return false

    for (let i = 0; i < pourCount; i++) {
      const colorIndex = sourceTube.lastIndexOf(sourceColor)
      const emptyIndex = targetTube.indexOf(null)
      if (colorIndex >= 0 && emptyIndex >= 0) {
        sourceTube[colorIndex] = null
        targetTube[emptyIndex] = sourceColor
      }
    }

    return true
  }

  public checkTubeSolved(tube: Tube): boolean {
    const tubeColors = tube.filter((color) => color !== null)
    return (
      tubeColors.length === 0 ||
      (tubeColors.length === this.tubeVolume &&
        tubeColors.every((color) => color === tubeColors[0]))
    )
  }

  public checkTubesSolved(tubes: Tube[] = this.tubes): boolean {
    return tubes.every(this.checkTubeSolved.bind(this))
  }

  public generateSolvedMoves(fastSearch = false, maxDepth = 1000): Move[] | null {
    const checkedStates = new Set<string>()

    const queue: { tubes: Tube[]; moves: Move[] }[] = [
      { tubes: this.tubes.map((tube) => [...tube]), moves: [] },
    ]

    while (queue.length > 0) {
      const state = fastSearch ? queue.pop()! : queue.shift()!
      const stateKey = JSON.stringify(state.tubes)

      if (checkedStates.has(stateKey)) continue
      checkedStates.add(stateKey)

      if (this.checkTubesSolved(state.tubes)) {
        this._moves = state.moves
        return state.moves
      }

      if (state.moves.length >= maxDepth) continue

      for (let source = 0; source < state.tubes.length; source++) {
        const sourceTube = state.tubes[source]!
        if (this.checkTubeSolved(sourceTube)) continue

        for (let target = 0; target < state.tubes.length; target++) {
          if (source === target) continue
          const targetTube = state.tubes[target]!

          if (targetTube[this.tubeVolume - 1] !== null) continue

          const lastMove = state.moves.at(-1)
          if (lastMove && lastMove[0] === target && lastMove[1] === source) continue

          const tubesCopy = state.tubes.map((tube) => [...tube])
          if (!this.pourColor(tubesCopy, source, target)) continue

          const copyStateKey = JSON.stringify(tubesCopy)
          if (checkedStates.has(copyStateKey)) continue

          queue.push({ tubes: tubesCopy, moves: [...state.moves, [source, target]] })
        }
      }
    }

    this._moves = []
    return null
  }

  public getTubesHistory(): Tube[][] {
    if (!this.tubes.length) return []

    if (!this.moves.length) {
      return [this.tubes.map((tube) => [...tube])]
    }

    const history: Tube[][] = [this.tubes.map((tube) => [...tube])]
    let tubes = this.tubes.map((tube) => [...tube])

    for (const [source, target] of this.moves) {
      const nextState = tubes.map((tube) => [...tube])
      const success = this.pourColor(nextState, source, target)
      if (!success) break
      history.push(nextState)
      tubes = nextState
    }

    return history
  }
}
