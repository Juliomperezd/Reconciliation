// ─── Days ────────────────────────────────────────────────────────────────────
export const days = [
  { id: '2026-03-01', label: 'Sun', dayNumber: 1,  status: 'ok',      totalPOS: 980.50,  totalDeclared: 980.50,  commentCount: 0, isToday: false },
  { id: '2026-03-02', label: 'Mon', dayNumber: 2,  status: 'ok',      totalPOS: 1100.00, totalDeclared: 1100.00, commentCount: 2, isToday: false },
  { id: '2026-03-03', label: 'Tue', dayNumber: 3,  status: 'warning', totalPOS: 875.25,  totalDeclared: 860.00,  commentCount: 1, isToday: false },
  { id: '2026-03-04', label: 'Wed', dayNumber: 4,  status: 'ok',      totalPOS: 1430.75, totalDeclared: 1430.75, commentCount: 0, isToday: false },
  { id: '2026-03-05', label: 'Thu', dayNumber: 5,  status: 'warning', totalPOS: 2100.00, totalDeclared: 2050.50, commentCount: 3, isToday: false },
  { id: '2026-03-06', label: 'Fri', dayNumber: 6,  status: 'ok',      totalPOS: 3200.00, totalDeclared: 3200.00, commentCount: 0, isToday: false },
  { id: '2026-03-07', label: 'Sat', dayNumber: 7,  status: 'ok',      totalPOS: 4100.50, totalDeclared: 4100.50, commentCount: 1, isToday: false },
  { id: '2026-03-08', label: 'Sun', dayNumber: 8,  status: 'warning', totalPOS: 1214.96, totalDeclared: 1193.48, commentCount: 2, isToday: false },
  { id: '2026-03-09', label: 'Mon', dayNumber: 9,  status: 'ok',      totalPOS: 1340.00, totalDeclared: 1340.00, commentCount: 0, isToday: false },
  { id: '2026-03-10', label: 'Tue', dayNumber: 10, status: 'warning', totalPOS: 1560.80, totalDeclared: 1490.30, commentCount: 2, isToday: true  },
];

// ─── Tenders ─────────────────────────────────────────────────────────────────
export const tenders = [
  { id: 'sunday-qr',    name: 'Sunday QR',     icon: '📱', posId: 'SUNDAY_QR_v2',       totalInToast: 350.00,  totalDeclared: 337.50, delta: 12.50,   status: 'warning' },
  { id: 'sunday-pdq',   name: 'Sunday PDQ',    icon: '💳', posId: 'SUNDAY_PDQ_terminal', totalInToast: 420.80,  totalDeclared: 420.80, delta: 0,       status: 'ok'      },
  { id: 'cash',         name: 'Cash',          icon: '💵', posId: 'CASH_TENDER',         totalInToast: 310.00,  totalDeclared: 280.00, delta: 30.00,   status: 'warning' },
  { id: 'petty-cash',   name: 'Petty Cash',    icon: '🪙', posId: 'PETTY_CASH_FLOAT',    totalInToast: 45.00,   totalDeclared: 45.00,  delta: 0,       status: 'ok'      },
  { id: 'deposit',      name: 'Deposit',       icon: '🏦', posId: 'DEPOSIT_SAFE',        totalInToast: 200.00,  totalDeclared: 200.00, delta: 0,       status: 'ok'      },
  { id: 'gift-voucher', name: 'Gift Voucher',  icon: '🎟️', posId: 'GIFT_VOUCHER_EXT',    totalInToast: 110.00,  totalDeclared: 110.00, delta: 0,       status: 'ok'      },
  { id: 'gift-coin',    name: 'Gift Coin',     icon: '🎖️', posId: 'GIFT_COIN_INTERNAL',  totalInToast: 125.00,  totalDeclared: 97.00,  delta: 28.00,   status: 'warning' },
];

// ─── Operations ───────────────────────────────────────────────────────────────
export const operations = [
  {
    id: 'op-1',
    dateTime: '02:48 PM\n09/26/2023',
    source: 'Table 12',
    sourceType: 'QR Code',
    server: 'David Joseph',
    paymentMethod: { color: '#1565C0', last4: '4242' },
    total: 46.00,
    sundayStatus: 'Partially paid',
    posStatus: 'Not notified',
    hasIssue: true,
  },
  {
    id: 'op-2',
    dateTime: '03:15 PM\n09/26/2023',
    source: 'Table 5',
    sourceType: 'QR Code',
    server: 'Sarah Miller',
    paymentMethod: { color: '#AD1457', last4: '8891' },
    total: 82.50,
    sundayStatus: 'Paid',
    posStatus: 'Notified',
    hasIssue: false,
  },
  {
    id: 'op-3',
    dateTime: '04:02 PM\n09/26/2023',
    source: 'Table 3',
    sourceType: 'PDQ',
    server: 'David Joseph',
    paymentMethod: { color: '#2E7D32', last4: '3312' },
    total: 124.00,
    sundayStatus: 'Paid',
    posStatus: 'Notified',
    hasIssue: false,
  },
  {
    id: 'op-4',
    dateTime: '04:45 PM\n09/26/2023',
    source: 'Table 8',
    sourceType: 'QR Code',
    server: 'Maria Gonzalez',
    paymentMethod: { color: '#6A1B9A', last4: '7754' },
    total: 37.00,
    sundayStatus: 'Refunded',
    posStatus: 'Not notified',
    hasIssue: true,
  },
  {
    id: 'op-5',
    dateTime: '05:30 PM\n09/26/2023',
    source: 'Table 1',
    sourceType: 'QR Code',
    server: 'James Wilson',
    paymentMethod: { color: '#E65100', last4: '5523' },
    total: 215.00,
    sundayStatus: 'Paid',
    posStatus: 'Notified',
    hasIssue: false,
  },
  {
    id: 'op-6',
    dateTime: '06:10 PM\n09/26/2023',
    source: 'Table 14',
    sourceType: 'PDQ',
    server: 'Sarah Miller',
    paymentMethod: { color: '#1565C0', last4: '9981' },
    total: 68.50,
    sundayStatus: 'Partially paid',
    posStatus: 'Not notified',
    hasIssue: true,
  },
  {
    id: 'op-7',
    dateTime: '07:22 PM\n09/26/2023',
    source: 'Table 9',
    sourceType: 'QR Code',
    server: 'David Joseph',
    paymentMethod: { color: '#AD1457', last4: '1134' },
    total: 94.00,
    sundayStatus: 'Paid',
    posStatus: 'Notified',
    hasIssue: false,
  },
  {
    id: 'op-8',
    dateTime: '08:05 PM\n09/26/2023',
    source: 'Table 2',
    sourceType: 'QR Code',
    server: 'Maria Gonzalez',
    paymentMethod: { color: '#2E7D32', last4: '6678' },
    total: 53.75,
    sundayStatus: 'Paid',
    posStatus: 'Notified',
    hasIssue: false,
  },
];

// ─── Comments ─────────────────────────────────────────────────────────────────
export const initialComments = [
  {
    id: 'c-1',
    author: { name: 'Sarah Miller', initials: 'SM', color: '#E91E8C', role: 'Manager' },
    time: '10:32 AM',
    message: 'The cash discrepancy seems to be from the morning shift. Checking with the team.',
    isAI: false,
  },
  {
    id: 'c-2',
    author: { name: 'David Joseph', initials: 'DJ', color: '#1565C0', role: 'Server' },
    time: '11:45 AM',
    message: 'I noticed 3 tables paid via QR but the amounts don\'t match Toast. Could be a timing issue.',
    isAI: false,
  },
];

// ─── SundayAI Gaps ───────────────────────────────────────────────────────────
export const sundayAIGaps = [
  {
    id: 1,
    title: '3 refunds not added in Toast',
    detail: 'Payments Op#4, Op#6, and Op#9 were refunded in Sunday but the corresponding void was never processed in Toast POS. Total impact: $70.50. You need to manually void these checks in Toast to balance the reconciliation.',
  },
  {
    id: 2,
    title: 'QR Code payment timing mismatch',
    detail: 'Table 12 payment of $46.00 was captured at 02:48 PM in Sunday but appears as a next-day transaction in Toast due to batch settlement timing. This is a known issue with Toast\'s end-of-day cut-off at 3:00 AM. No action needed — will resolve automatically.',
  },
  {
    id: 3,
    title: 'Cash declared $30 short',
    detail: 'The cash tender shows a $30.00 discrepancy. Based on transaction history, this likely corresponds to a petty cash withdrawal that was not logged. Please check petty cash log and add missing entry.',
  },
];

// ─── Help Cards ───────────────────────────────────────────────────────────────
export const helpCards = [
  {
    id: 'h-1',
    title: 'How to reconcile tenders',
    subtitle: 'Step-by-step guide to matching your POS and Sunday totals',
  },
  {
    id: 'h-2',
    title: 'Understanding discrepancies',
    subtitle: 'Common causes and how to resolve them quickly',
  },
  {
    id: 'h-3',
    title: 'Export & reporting',
    subtitle: 'How to generate and share daily reports with your team',
  },
];

// ─── POS Tenders (for Add Tender dropdown) ───────────────────────────────────
export const posTenders = [
  'Sunday QR',
  'Sunday PDQ',
  'Cash',
  'Petty Cash',
  'Deposit',
  'Gift Voucher',
  'Gift Coin',
];
