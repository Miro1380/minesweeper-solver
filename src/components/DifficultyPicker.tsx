import { DIFFICULTIES, type DifficultyKey } from '../engine/types'

interface DifficultyPickerProps {
  readonly value: DifficultyKey
  readonly onChange: (key: DifficultyKey) => void
}

const KEYS = Object.keys(DIFFICULTIES) as DifficultyKey[]

export function DifficultyPicker({ value, onChange }: DifficultyPickerProps) {
  return (
    <div className="difficulty-picker" role="radiogroup" aria-label="Difficulty">
      {KEYS.map((key) => (
        <button
          key={key}
          type="button"
          role="radio"
          aria-checked={key === value}
          className={
            key === value
              ? 'difficulty-picker__option difficulty-picker__option--active'
              : 'difficulty-picker__option'
          }
          onClick={() => {
            onChange(key)
          }}
        >
          {DIFFICULTIES[key].label}
        </button>
      ))}
    </div>
  )
}
