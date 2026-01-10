# podpdf

**Ultra-fast, zero-dependency PDF generation for Node.js & Bun**

[![npm version](https://img.shields.io/npm/v/podpdf.svg)](https://www.npmjs.com/package/podpdf)
[![bundle size](https://img.shields.io/badge/size-8KB-brightgreen)](https://bundlephobia.com/package/podpdf)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-blue)](https://www.npmjs.com/package/podpdf)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support-yellow?logo=buy-me-a-coffee)](https://buymeacoffee.com/herostack)

```
~9 KB minified  •  Zero dependencies  •  5x faster than jsPDF  •  TypeScript native
```

## Why podpdf?

| Library | Size | Dependencies | Speed |
|---------|------|--------------|-------|
| **podpdf** | **~9 KB** | **0** | **5.5x** |
| **podpdf/plus** | **~13 KB** | **0** | **5x** |
| jsPDF | 290 KB | 2+ | 1x |
| pdfkit | 1 MB | 10+ | 0.8x |

## Feature Comparison

| Feature | podpdf | podpdf/plus | jsPDF | pdfkit |
|---------|:------:|:-----------:|:-----:|:------:|
| **Text** | ✅ | ✅ | ✅ | ✅ |
| **Text Styling (bold/italic)** | ✅ | ✅ | ✅ | ✅ |
| **Text Wrap** | ✅ | ✅ | ✅ | ✅ |
| **Text Alignment** | ✅ | ✅ | ✅ | ✅ |
| **Rectangle** | ✅ | ✅ | ✅ | ✅ |
| **Rounded Rectangle** | ✅ | ✅ | ✅ | ✅ |
| **Circle** | ✅ | ✅ | ✅ | ✅ |
| **Line (solid/dashed)** | ✅ | ✅ | ✅ | ✅ |
| **Tables** | ✅ | ✅ | ⚠️ Plugin | ⚠️ Manual |
| **Images (JPEG)** | ✅ | ✅ | ✅ | ✅ |
| **Images (PNG)** | ❌ | ✅ | ✅ | ✅ |
| **Links/URLs** | ✅ | ✅ | ✅ | ✅ |
| **Multi-page** | ✅ | ✅ | ✅ | ✅ |
| **Document Metadata** | ✅ | ✅ | ✅ | ✅ |
| **Custom Fonts (TTF)** | ❌ | ✅ | ✅ | ✅ |
| **Vector Graphics** | ⚠️ Basic | ⚠️ Basic | ✅ | ✅ Full |
| **Forms/Fields** | ❌ | ❌ | ✅ | ✅ |
| **Encryption** | ❌ | ❌ | ✅ | ✅ |
| **TypeScript Native** | ✅ | ✅ | ❌ | ❌ |
| **Fluent API** | ✅ | ✅ | ⚠️ Partial | ✅ |
| **Browser Support** | ✅ | ✅ | ✅ | ❌ |
| **Node.js/Bun** | ✅ | ✅ | ✅ | ✅ |

> **podpdf** - Best balance of size, speed, and features for common use-cases (invoices, reports, tables)

## Installation

```bash
npm install podpdf
# or
yarn add podpdf
# or
pnpm add podpdf
# or
bun add podpdf
```

## Quick Start

```typescript
import { pdf } from 'podpdf'

await pdf('A4')
  .text('Hello World!', 50, 50, { size: 24, weight: 'bold' })
  .rect(50, 80, 200, 100, { fill: '#3498db', radius: 10 })
  .save('hello.pdf')
```

## Features

- **Text** - Multiple fonts, sizes, colors, alignment, text wrapping
- **Shapes** - Rectangle, rounded rectangle, circle, line (solid & dashed)
- **Tables** - Easy table creation with headers, styling, alignment
- **Images** - JPEG support (PNG via podpdf/plus)
- **Links** - Clickable URLs with optional underline
- **Multi-page** - Multiple pages with different sizes
- **Metadata** - Document title, author, subject, keywords
- **Fluent API** - Chainable methods for clean code

### podpdf/plus (Extended)

For PNG images and custom fonts, use `podpdf/plus`:

```typescript
import { pdfPlus } from 'podpdf/plus'

// Load custom font
const fontData = await Bun.file('custom-font.ttf').bytes()

// Load PNG image
const pngData = await Bun.file('logo.png').bytes()

await pdfPlus('A4')
  .registerFont('custom', fontData)
  .text('Custom Font Text', 50, 50, { font: 'custom' })
  .imagePng(pngData, 50, 100, { width: 200 })  // async method
  .save('output.pdf')
```

## API Reference

### Create Document

```typescript
import { pdf, PDF, SIZES } from 'podpdf'

// Using helper function
const doc = pdf('A4')

// Available sizes: A3, A4, A5, LETTER
// Or custom: pdf({ width: 600, height: 800 })
```

### Text

```typescript
.text(content, x, y, options?)
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `size` | number | 12 | Font size |
| `color` | string | '#000' | Color (hex) |
| `weight` | string | 'normal' | 'normal', 'bold', 'italic', 'bolditalic' |
| `align` | string | 'left' | 'left', 'center', 'right' |
| `maxWidth` | number | - | Auto wrap text |

```typescript
.text('Title', 50, 50, { size: 24, weight: 'bold', color: '#333' })
.text('Centered', 297, 100, { align: 'center' })
.text('Long text...', 50, 150, { maxWidth: 400 })
```

### Shapes

```typescript
// Rectangle
.rect(x, y, width, height, { fill?, stroke?, lineWidth?, radius? })

// Circle
.circle(cx, cy, radius, { fill?, stroke?, lineWidth? })

// Line
.line(x1, y1, x2, y2, { color?, width?, dash? })
```

```typescript
.rect(50, 50, 200, 100, { fill: '#e74c3c' })
.rect(50, 50, 200, 100, { fill: '#3498db', radius: 15 })
.circle(150, 200, 50, { fill: '#9b59b6' })
.line(50, 300, 250, 300, { color: '#2ecc71', width: 2 })
.line(50, 320, 250, 320, { dash: [5, 3] })
```

### Tables

```typescript
.table(data, x, y, options)
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `columns` | array | required | Column definitions |
| `headerBg` | string | '#F0F0F0' | Header background |
| `headerColor` | string | '#000' | Header text color |
| `borderColor` | string | '#CCC' | Border color |
| `fontSize` | number | 10 | Font size |
| `padding` | number | 8 | Cell padding |

```typescript
.table(
  [
    ['John', '25', 'Admin'],
    ['Jane', '30', 'User'],
  ],
  50, 100,
  {
    columns: [
      { header: 'Name', width: 100 },
      { header: 'Age', width: 60, align: 'center' },
      { header: 'Role', width: 80 },
    ],
    headerBg: '#2c3e50',
    headerColor: '#fff'
  }
)
```

### Images

```typescript
const imageData = await Bun.file('photo.jpg').bytes()
// or: Buffer.from(fs.readFileSync('photo.jpg'))

.image(imageData, x, y, { width?, height? })
```

### Links

```typescript
.link('Click here', 'https://example.com', x, y, { underline?, color? })
```

### Pages

```typescript
.page()           // Add page with default size
.page('A5')       // Different size
.page({ width: 500, height: 700 })  // Custom
```

### Metadata

```typescript
.metadata({ title?, author?, subject?, keywords?, creator? })
```

```typescript
pdf('A4')
  .metadata({
    title: 'Invoice #123',
    author: 'Company Name',
    subject: 'Monthly Invoice',
    keywords: 'invoice, billing'
  })
  .text('...', 50, 50)
  .save('invoice.pdf')
```

### Output

```typescript
// Save to file
await doc.save('output.pdf')

// Get as Uint8Array
const bytes = doc.build()
```

## Examples

### Complete Invoice

```typescript
import { pdf } from 'podpdf'

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

const fmt = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2 })

await pdf('A4')
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
    invoice.items.map(i => [i.desc, i.qty.toString(), fmt(i.rate), fmt(i.amount)]),
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
  .text('Subtotal:', 345, 500, { size: 11 })
  .text(fmt(subtotal), 500, 500, { size: 11, align: 'right' })
  .text('Tax (10%):', 345, 520, { size: 11 })
  .text(fmt(tax), 500, 520, { size: 11, align: 'right' })
  .line(345, 540, 500, 540, { color: '#e0e0e0' })
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

  .save('invoice.pdf')
```

### Report with Chart

```typescript
import { pdf } from 'podpdf'

const data = [120, 150, 180, 140, 200]
const max = Math.max(...data)

const doc = pdf('A4')
  .text('Sales Report', 50, 50, { size: 24, weight: 'bold' })

// Simple bar chart
for (let i = 0; i < data.length; i++) {
  const height = (data[i] / max) * 100
  doc.rect(80 + i * 60, 200 - height, 40, height, { fill: '#3498db', radius: 3 })
}

await doc.save('report.pdf')
```

## Page Sizes

```typescript
import { SIZES } from 'podpdf'

SIZES.A3     // { width: 842, height: 1191 }
SIZES.A4     // { width: 595, height: 842 }
SIZES.A5     // { width: 420, height: 595 }
SIZES.LETTER // { width: 612, height: 792 }
```

## TypeScript

Full TypeScript support with exported types:

```typescript
import type {
  Color,       // string | [r, g, b]
  Align,       // 'left' | 'center' | 'right'
  Weight,      // 'normal' | 'bold' | 'italic' | 'bolditalic'
  Size,        // { width, height }
  PDFMetadata, // { title?, author?, subject?, keywords?, creator? }
  TextOpts,
  RectOpts,
  LineOpts,
  CircleOpts,
  ImageOpts,
  LinkOpts,
  TableCol,
  TableOpts
} from 'podpdf'
```

## Benchmark

Tested with 1000 document generations:

| Test | podpdf | jsPDF |
|------|--------|-------|
| Simple text | 0.033ms | 0.271ms |
| Styled text | 0.044ms | 0.260ms |
| Shapes | 0.024ms | 0.254ms |
| Multi-page | 0.083ms | 0.251ms |
| Complex doc | 0.051ms | 0.260ms |

**Result: podpdf is 5.5x faster on average**

## Browser Support

podpdf is designed for Node.js and Bun. For browser usage, the `build()` method returns a `Uint8Array` that can be converted to a Blob:

```typescript
const bytes = doc.build()
const blob = new Blob([bytes], { type: 'application/pdf' })
const url = URL.createObjectURL(blob)
```

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a PR.
