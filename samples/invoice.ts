import { pdf } from '../src'

const invoice = {
  number: 'INV-2024-001',
  date: '2024-12-26',
  dueDate: '2025-01-26',
  company: {
    name: 'Tech Solutions Inc.',
    address: '123 Innovation Street',
    city: 'San Francisco, CA 94102',
    email: 'billing@techsolutions.com'
  },
  client: {
    name: 'Acme Corporation',
    address: '456 Business Avenue',
    city: 'New York, NY 10001',
    email: 'accounts@acme.com'
  },
  items: [
    { desc: 'Website Development', qty: 1, rate: 5000, amount: 5000 },
    { desc: 'Mobile App (iOS)', qty: 1, rate: 8000, amount: 8000 },
    { desc: 'UI/UX Design', qty: 40, rate: 75, amount: 3000 },
    { desc: 'API Integration', qty: 20, rate: 100, amount: 2000 },
    { desc: 'Quality Assurance', qty: 15, rate: 60, amount: 900 },
  ]
}

const subtotal = invoice.items.reduce((sum, i) => sum + i.amount, 0)
const tax = subtotal * 0.1
const total = subtotal + tax

const fmt = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const doc = pdf('A4')
  .page()

  // Header
  .rect(0, 0, 595, 100, { fill: '#1a1a2e' })
  .text(invoice.company.name.toUpperCase(), 50, 40, { size: 20, color: '#fff', weight: 'bold' })
  .text('INVOICE', 545, 35, { size: 28, color: '#4a9eff', weight: 'bold', align: 'right' })
  .text(invoice.number, 545, 65, { size: 12, color: '#888', align: 'right' })

  // From
  .text('From:', 50, 130, { size: 10, color: '#888' })
  .text(invoice.company.name, 50, 145, { size: 12, weight: 'bold' })
  .text(invoice.company.address, 50, 160, { size: 10 })
  .text(invoice.company.city, 50, 175, { size: 10 })
  .text(invoice.company.email, 50, 190, { size: 10, color: '#4a9eff' })

  // Bill To
  .text('Bill To:', 320, 130, { size: 10, color: '#888' })
  .text(invoice.client.name, 320, 145, { size: 12, weight: 'bold' })
  .text(invoice.client.address, 320, 160, { size: 10 })
  .text(invoice.client.city, 320, 175, { size: 10 })
  .text(invoice.client.email, 320, 190, { size: 10, color: '#4a9eff' })

  // Date boxes
  .rect(50, 220, 160, 45, { fill: '#f8f9fa', radius: 5 })
  .text('Invoice Date', 60, 235, { size: 9, color: '#888' })
  .text(invoice.date, 60, 252, { size: 12, weight: 'bold' })

  .rect(230, 220, 160, 45, { fill: '#f8f9fa', radius: 5 })
  .text('Due Date', 240, 235, { size: 9, color: '#888' })
  .text(invoice.dueDate, 240, 252, { size: 12, weight: 'bold' })

  // Items Table
  .table(
    invoice.items.map(i => [
      i.desc,
      i.qty.toString(),
      fmt(i.rate),
      fmt(i.amount)
    ]),
    50, 290,
    {
      columns: [
        { header: 'Description', width: 220 },
        { header: 'Qty', width: 60, align: 'center' },
        { header: 'Rate', width: 90, align: 'right' },
        { header: 'Amount', width: 95, align: 'right' },
      ],
      headerBg: '#1a1a2e',
      headerColor: '#fff',
      borderColor: '#e0e0e0',
      fontSize: 10,
      padding: 10
    }
  )

  // Summary Box
  .rect(330, 480, 185, 100, { stroke: '#e0e0e0', radius: 5 })

  // Subtotal row
  .text('Subtotal:', 345, 500, { size: 11 })
  .text(fmt(subtotal), 500, 500, { size: 11, align: 'right' })

  // Tax row
  .text('Tax (10%):', 345, 520, { size: 11 })
  .text(fmt(tax), 500, 520, { size: 11, align: 'right' })

  // Divider
  .line(345, 540, 500, 540, { color: '#e0e0e0' })

  // Total row
  .rect(330, 548, 185, 30, { fill: '#1a1a2e', radius: 5 })
  .text('Total:', 345, 567, { size: 12, weight: 'bold', color: '#fff' })
  .text(fmt(total), 500, 567, { size: 12, weight: 'bold', color: '#fff', align: 'right' })

  // Payment Info
  .rect(50, 610, 230, 90, { fill: '#f0f7ff', radius: 5 })
  .text('Payment Information', 65, 630, { size: 11, weight: 'bold', color: '#1a1a2e' })
  .text('Bank: First National Bank', 65, 650, { size: 9 })
  .text('Account: 1234-5678-9012', 65, 665, { size: 9 })
  .text('SWIFT: FNBKUS12', 65, 680, { size: 9 })

  // Terms
  .rect(300, 610, 215, 90, { fill: '#fff9e6', radius: 5 })
  .text('Terms & Conditions', 315, 630, { size: 11, weight: 'bold', color: '#b8860b' })
  .text('Payment due within 30 days', 315, 650, { size: 9 })
  .text('Late fee: 1.5% per month', 315, 665, { size: 9 })
  .text('Make checks payable to:', 315, 680, { size: 9 })
  .text('Tech Solutions Inc.', 315, 695, { size: 9, weight: 'bold' })

  // Footer
  .line(50, 730, 545, 730, { color: '#eee' })
  .text('Thank you for your business!', 297, 750, { size: 11, color: '#666', align: 'center' })
  .text('Questions? Email billing@techsolutions.com', 297, 768, { size: 9, color: '#999', align: 'center' })

await doc.save('samples/invoice-demo.pdf')
console.log('Created: samples/invoice-demo.pdf')
