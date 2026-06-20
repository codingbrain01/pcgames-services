import type { DriveOption } from '../types'

export const drives: DriveOption[] = [
  { id: '500gb', label: '500GB', usableGB: 480, price: 1499 },
  { id: '1tb', label: '1TB', usableGB: 925, price: 2499 },
  { id: '2tb', label: '2TB', usableGB: 1853, price: 4899 },
  { id: '4tb', label: '4TB', usableGB: 3700, price: 7500 },
  { id: '6tb', label: '6TB', usableGB: 5560, price: 10499 },
  { id: '8tb', label: '8TB', usableGB: 7425, price: 14499 },
  { id: '10tb', label: '10TB', usableGB: 9288, price: 15499, badge: 'sale' },
  {
    id: '16tb',
    label: '16TB',
    usableGB: 14875,
    price: 23000,
    badge: 'mega sale',
  },
  { id: '20tb', label: '20TB', usableGB: 18400, price: 30999 },
]
