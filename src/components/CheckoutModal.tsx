import { useMemo, useState } from 'react'
import type { DriveOption, Game } from '../types'
import { formatPeso } from '../utils/format'

const messengerUrl =
  import.meta.env.VITE_MESSENGER_LINK ?? 'https://m.me/pcgamestandangsora'

interface CheckoutModalProps {
  drive: DriveOption
  selectedGames: Game[]
  usedGB: number
  onClose: () => void
}

interface CheckoutForm {
  fullName: string
  contactNumber: string
  completeAddress: string
  barangay: string
  landmark: string
  shippingOption: string
  paymentMethod: string
}

const initialForm: CheckoutForm = {
  fullName: '',
  contactNumber: '',
  completeAddress: '',
  barangay: '',
  landmark: '',
  shippingOption: 'Pickup',
  paymentMethod: 'GCash',
}

export function CheckoutModal({
  drive,
  selectedGames,
  usedGB,
  onClose,
}: CheckoutModalProps) {
  const [form, setForm] = useState(initialForm)
  const [orderCode, setOrderCode] = useState<string | null>(null)

  const isComplete =
    form.fullName.trim() &&
    form.contactNumber.trim() &&
    form.completeAddress.trim() &&
    form.barangay.trim() &&
    form.shippingOption &&
    form.paymentMethod

  const orderText = useMemo(
    () =>
      [
        `Order Code: ${orderCode ?? 'Pending'}`,
        `Name: ${form.fullName}`,
        `Contact: ${form.contactNumber}`,
        `Address: ${form.completeAddress}, ${form.barangay}`,
        form.landmark ? `Landmark: ${form.landmark}` : '',
        `Shipping: ${form.shippingOption}`,
        `Payment: ${form.paymentMethod}`,
        `Drive: ${drive.label} - ${formatPeso(drive.price)}`,
        `Games (${selectedGames.length}): ${selectedGames.map((game) => game.title).join(', ')}`,
      ]
        .filter(Boolean)
        .join('\n'),
    [drive, form, orderCode, selectedGames],
  )

  const updateField = (field: keyof CheckoutForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const generateOrder = () => {
    const code = `PCG-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    setOrderCode(code)
  }

  return (
    <div className="modal-backdrop">
      <section className="checkout-modal" aria-modal="true" role="dialog">
        <button className="modal-close" onClick={onClose} type="button">
          Close
        </button>
        <div className="section-heading">
          <p className="eyebrow">Almost done</p>
          <h2>Checkout</h2>
        </div>
        <div className="checkout-grid">
          <form className="checkout-form">
            <label>
              Full Name
              <input
                onChange={(event) => updateField('fullName', event.target.value)}
                value={form.fullName}
              />
            </label>
            <label>
              Contact Number
              <input
                onChange={(event) =>
                  updateField('contactNumber', event.target.value)
                }
                value={form.contactNumber}
              />
            </label>
            <label>
              Complete Address
              <textarea
                onChange={(event) =>
                  updateField('completeAddress', event.target.value)
                }
                value={form.completeAddress}
              />
            </label>
            <label>
              Barangay
              <input
                onChange={(event) => updateField('barangay', event.target.value)}
                value={form.barangay}
              />
            </label>
            <label>
              Landmark
              <input
                onChange={(event) => updateField('landmark', event.target.value)}
                value={form.landmark}
              />
            </label>
            <label>
              Shipping Option
              <select
                onChange={(event) =>
                  updateField('shippingOption', event.target.value)
                }
                value={form.shippingOption}
              >
                <option>Pickup</option>
                <option>Delivery</option>
                <option>Lalamove</option>
                <option>Grab</option>
              </select>
            </label>
            <label>
              Payment Method
              <select
                onChange={(event) =>
                  updateField('paymentMethod', event.target.value)
                }
                value={form.paymentMethod}
              >
                <option>GCash</option>
                <option>Maya</option>
                <option>Cash</option>
              </select>
            </label>
          </form>
          <aside className="order-card">
            <h3>Order Summary</h3>
            <p>
              <strong>{drive.label}</strong> package - {usedGB.toFixed(1)}GB used
            </p>
            <p>{selectedGames.length} games selected</p>
            <strong className="price">{formatPeso(drive.price)}</strong>
            <div className="order-games">
              {selectedGames.map((game) => (
                <span key={game.id}>{game.title}</span>
              ))}
            </div>
            <p className="privacy-note">
              Your details stay on this device until you send the order through
              Messenger.
            </p>
            {orderCode && <p className="order-code">{orderCode}</p>}
            <button
              className="primary-action"
              disabled={!isComplete}
              onClick={generateOrder}
              type="button"
            >
              Generate Order
            </button>
            {orderCode && (
              <a
                className="messenger-link"
                href={`${messengerUrl}?text=${encodeURIComponent(orderText)}`}
                rel="noreferrer"
                target="_blank"
              >
                Send Order via Messenger
              </a>
            )}
          </aside>
        </div>
      </section>
    </div>
  )
}
