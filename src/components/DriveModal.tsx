import { useState } from 'react'
import type { DriveOption } from '../types'
import { formatPeso } from '../utils/format'

interface DriveModalProps {
  drives: DriveOption[]
  selectedDriveId: string | null
  onChoose: (driveId: string) => void
}

export function DriveModal({
  drives,
  selectedDriveId,
  onChoose,
}: DriveModalProps) {
  const [draftDriveId, setDraftDriveId] = useState(selectedDriveId ?? drives[0].id)

  return (
    <div className="modal-backdrop modal-backdrop--locked">
      <section className="drive-modal" aria-modal="true" role="dialog">
        <div className="brand-mark">PC</div>
        <p className="eyebrow">Storage first</p>
        <h2>CHOOSE YOUR DRIVE SIZE</h2>
        <p className="muted">Piliin muna ang laki ng drive mo bago pumili ng games.</p>
        <div className="drive-grid">
          {drives.map((drive) => (
            <button
              className={`drive-card ${draftDriveId === drive.id ? 'is-active' : ''}`}
              key={drive.id}
              onClick={() => setDraftDriveId(drive.id)}
              type="button"
            >
              <span className="drive-card__label">{drive.label}</span>
              <span className="drive-card__usable">{drive.usableGB}GB usable</span>
              <strong>{formatPeso(drive.price)}</strong>
              {drive.badge && <span className="sale-badge">{drive.badge}</span>}
            </button>
          ))}
        </div>
        <button
          className="primary-action"
          onClick={() => onChoose(draftDriveId)}
          type="button"
        >
          START PICKING GAMES
        </button>
      </section>
    </div>
  )
}
