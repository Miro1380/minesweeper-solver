import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Board } from './Board'
import { createEmptyBoard } from '../engine/board'
import { coordinate, type Deduction } from '../engine/types'

describe('Board', () => {
  it('calls onReveal with the clicked cell coordinate', async () => {
    const user = userEvent.setup()
    const board = createEmptyBoard(2, 2, 0)
    const onReveal = vi.fn()

    render(
      <Board
        board={board}
        interactive
        hint={undefined}
        onReveal={onReveal}
        onToggleFlag={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Row 1, column 1' }))

    expect(onReveal).toHaveBeenCalledWith(coordinate(0, 0))
  })

  it('calls onToggleFlag on right-click without revealing', () => {
    const board = createEmptyBoard(2, 2, 0)
    const onReveal = vi.fn()
    const onToggleFlag = vi.fn()

    render(
      <Board
        board={board}
        interactive
        hint={undefined}
        onReveal={onReveal}
        onToggleFlag={onToggleFlag}
      />,
    )

    fireEvent.contextMenu(screen.getByRole('button', { name: 'Row 1, column 2' }))

    expect(onToggleFlag).toHaveBeenCalledWith(coordinate(0, 1))
    expect(onReveal).not.toHaveBeenCalled()
  })

  it('disables every cell, and ignores clicks, when not interactive', async () => {
    const user = userEvent.setup()
    const board = createEmptyBoard(2, 2, 0)
    const onReveal = vi.fn()

    render(
      <Board
        board={board}
        interactive={false}
        hint={undefined}
        onReveal={onReveal}
        onToggleFlag={vi.fn()}
      />,
    )

    const cell = screen.getByRole('button', { name: 'Row 1, column 1' })
    expect(cell).toBeDisabled()

    await user.click(cell)
    expect(onReveal).not.toHaveBeenCalled()
  })

  it('highlights the cell named by the current hint', () => {
    const board = createEmptyBoard(2, 2, 0)
    const hint: Deduction = { coord: coordinate(1, 0), verdict: 'safe', reason: 'test' }

    render(
      <Board board={board} interactive hint={hint} onReveal={vi.fn()} onToggleFlag={vi.fn()} />,
    )

    expect(screen.getByRole('button', { name: 'Row 2, column 1' })).toHaveClass('cell--hint-safe')
    expect(screen.getByRole('button', { name: 'Row 1, column 1' })).not.toHaveClass(
      'cell--hint-safe',
    )
  })
})
