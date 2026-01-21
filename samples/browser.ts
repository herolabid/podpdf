// Browser usage example - use with Vite, webpack, or any bundler
// Run: npm create vite@latest my-app -- --template vanilla-ts
// Then copy this file and import it

import { pdf } from '../src/browser'

// Example 1: Simple PDF with download
export function generateSimplePDF() {
  pdf('A4')
    .text('Simple PDF Example', 50, 50, { size: 24, weight: 'bold', color: '#2c3e50' })
    .text('Generated using podpdf/browser', 50, 85, { size: 14, color: '#666' })
    .rect(50, 120, 495, 100, { fill: '#ecf0f1', radius: 10 })
    .text('Features:', 70, 150, { size: 16, weight: 'bold' })
    .text('✓ Zero dependencies', 70, 175, { size: 12 })
    .text('✓ Ultra-fast generation', 70, 195, { size: 12 })
    .text('✓ Browser-native', 70, 215, { size: 12 })
    .circle(297, 320, 40, { fill: '#3498db' })
    .text('Generated at: ' + new Date().toLocaleString(), 297, 400, {
      size: 10,
      color: '#999',
      align: 'center'
    })
    .download('simple.pdf')
}

// Example 2: Invoice
export function generateInvoice() {
  const invoice = {
    number: 'INV-2024-001',
    date: '2024-12-26',
    items: [
      ['Web Development', '1', '$5,000', '$5,000'],
      ['Mobile App', '1', '$8,000', '$8,000'],
      ['UI/UX Design', '40 hrs', '$75', '$3,000'],
    ]
  }

  pdf('A4')
    // Header
    .rect(0, 0, 595, 80, { fill: '#2c3e50' })
    .text('INVOICE', 50, 35, { size: 28, color: '#fff', weight: 'bold' })
    .text(invoice.number, 545, 35, { size: 14, color: '#3498db', align: 'right' })

    // From
    .text('From: Tech Solutions Inc.', 50, 110, { size: 12, weight: 'bold' })
    .text('123 Innovation Street, SF, CA 94102', 50, 130, { size: 10 })

    // Bill To
    .text('Bill To: Acme Corporation', 50, 170, { size: 12, weight: 'bold' })
    .text('456 Business Avenue, NY, NY 10001', 50, 190, { size: 10 })

    // Table
    .table(invoice.items, 50, 240, {
      columns: [
        { header: 'Description', width: 200 },
        { header: 'Qty', width: 80, align: 'center' },
        { header: 'Rate', width: 100, align: 'right' },
        { header: 'Amount', width: 115, align: 'right' },
      ],
      headerBg: '#2c3e50',
      headerColor: '#fff',
      borderColor: '#ddd'
    })

    // Summary
    .rect(380, 380, 165, 80, { stroke: '#ddd', radius: 5 })
    .text('Subtotal:', 395, 405, { size: 11 })
    .text('$16,000.00', 530, 405, { size: 11, align: 'right' })
    .text('Tax (10%):', 395, 425, { size: 11 })
    .text('$1,600.00', 530, 425, { size: 11, align: 'right' })
    .line(395, 440, 530, 440, { color: '#ddd' })
    .text('Total:', 395, 455, { size: 12, weight: 'bold' })
    .text('$17,600.00', 530, 455, { size: 12, weight: 'bold', align: 'right' })

    .text('Thank you for your business!', 297, 550, {
      size: 12,
      color: '#666',
      align: 'center'
    })
    .download('invoice.pdf')
}

// Example 3: Preview in iframe
export function previewPDF(): string {
  const doc = pdf('A4')
    .text('PDF Preview Example', 50, 50, { size: 24, weight: 'bold' })
    .text('This PDF is rendered directly in browser', 50, 85, { size: 14 })
    .rect(50, 120, 200, 100, { fill: '#e74c3c', radius: 10 })
    .rect(270, 120, 200, 100, { fill: '#3498db', radius: 10 })
    .circle(150, 300, 50, { fill: '#2ecc71' })
    .text('Preview Mode', 297, 400, {
      size: 16,
      align: 'center',
      weight: 'bold'
    })

  return doc.toDataURL()
}

// Example 4: Get Blob for custom handling
export function getBlobExample(): Blob {
  const doc = pdf('A4')
    .text('Blob Example', 50, 50, { size: 24, weight: 'bold' })
    .text('You can handle the Blob yourself', 50, 85, { size: 14 })
    .rect(50, 120, 200, 100, { fill: '#9b59b6', radius: 10 })

  return doc.toBlob()
}

// Usage in HTML:
// <button onclick="generateSimplePDF()">Download Simple PDF</button>
// <button onclick="generateInvoice()">Download Invoice</button>
// <button onclick="const url = previewPDF(); document.getElementById('preview').src = url">Preview PDF</button>
