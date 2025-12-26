# podpdf

**Ultra-fast, zero-dependency PDF generation for Node.js & Bun**

[![npm version](https://img.shields.io/npm/v/podpdf.svg)](https://www.npmjs.com/package/podpdf)
[![bundle size](https://img.shields.io/badge/size-8KB-brightgreen)](https://bundlephobia.com/package/podpdf)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-blue)](https://www.npmjs.com/package/podpdf)

```
8 KB minified  •  Zero dependencies  •  5x faster than jsPDF  •  TypeScript native
```

## Why podpdf?

| Library | Size | Dependencies | Speed |
|---------|------|--------------|-------|
| **podpdf** | **8 KB** | **0** | **5.5x** |
| jsPDF | 290 KB | 2+ | 1x |
| pdfkit | 1 MB | 10+ | 0.8x |

## Feature Comparison

| Feature | podpdf | jsPDF | pdfkit |
|---------|:------:|:-----:|:------:|
| **Text** | ✅ | ✅ | ✅ |
| **Text Styling (bold/italic)** | ✅ | ✅ | ✅ |
| **Text Wrap** | ✅ | ✅ | ✅ |
| **Text Alignment** | ✅ | ✅ | ✅ |
| **Rectangle** | ✅ | ✅ | ✅ |
| **Rounded Rectangle** | ✅ | ✅ | ✅ |
| **Circle** | ✅ | ✅ | ✅ |
| **Line (solid/dashed)** | ✅ | ✅ | ✅ |
| **Tables** | ✅ | ⚠️ Plugin | ⚠️ Manual |
| **Images (JPEG/PNG)** | ✅ | ✅ | ✅ |
| **Links/URLs** | ✅ | ✅ | ✅ |
| **Multi-page** | ✅ | ✅ | ✅ |
| **Custom Fonts** | ❌ | ✅ | ✅ |
| **Vector Graphics** | ⚠️ Basic | ✅ | ✅ Full |
| **Forms/Fields** | ❌ | ✅ | ✅ |
| **Encryption** | ❌ | ✅ | ✅ |
| **TypeScript Native** | ✅ | ❌ | ❌ |
| **Fluent API** | ✅ | ⚠️ Partial | ✅ |
| **Browser Support** | ✅ | ✅ | ❌ |
| **Node.js/Bun** | ✅ | ✅ | ✅ |

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
- **Images** - JPEG and PNG support
- **Links** - Clickable URLs with optional underline
- **Multi-page** - Multiple pages with different sizes
- **Fluent API** - Chainable methods for clean code

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

### Output

```typescript
// Save to file
await doc.save('output.pdf')

// Get as Uint8Array
const bytes = doc.build()
```

## Examples

### Invoice

```typescript
import { pdf } from 'podpdf'

await pdf('A4')
  .rect(0, 0, 595, 80, { fill: '#1a1a2e' })
  .text('INVOICE', 50, 45, { size: 28, color: '#fff', weight: 'bold' })
  .text('#INV-001', 545, 45, { size: 12, color: '#888', align: 'right' })

  .text('Bill To:', 50, 120, { size: 10, color: '#888' })
  .text('Acme Corp', 50, 135, { weight: 'bold' })

  .table(
    [
      ['Web Development', '40 hrs', '$4,000'],
      ['Design', '20 hrs', '$1,600'],
    ],
    50, 180,
    {
      columns: [
        { header: 'Description', width: 250 },
        { header: 'Hours', width: 100, align: 'center' },
        { header: 'Amount', width: 100, align: 'right' },
      ],
      headerBg: '#1a1a2e',
      headerColor: '#fff'
    }
  )

  .text('Total: $5,600', 450, 320, { size: 16, weight: 'bold', align: 'right' })
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
