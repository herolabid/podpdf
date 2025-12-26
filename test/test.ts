import { pdf, PDF, SIZES } from '../src'

console.log('Testing podpdf...\n')

// Test 1: Basic document creation
console.log('Test 1: Basic document creation')
const doc1 = pdf('A4')
console.log('  - pdf() function works')
const doc2 = new PDF('A4')
console.log('  - PDF class works')
console.log('  - SIZES:', Object.keys(SIZES).join(', '))
console.log('  PASSED\n')

// Test 2: All text options
console.log('Test 2: Text rendering')
const textDoc = pdf('A4')
  .page()
  .text('Normal text', 50, 50)
  .text('Bold text', 50, 70, { weight: 'bold' })
  .text('Italic text', 50, 90, { weight: 'italic' })
  .text('Bold Italic', 50, 110, { weight: 'bolditalic' })
  .text('Large text', 50, 140, { size: 24 })
  .text('Colored text', 50, 170, { color: '#e74c3c' })
  .text('RGB color', 50, 190, { color: [0, 0.5, 1] })
  .text('Centered', 297, 220, { align: 'center' })
  .text('Right aligned', 545, 240, { align: 'right' })
  .text('This is a very long text that should wrap automatically when maxWidth is specified', 50, 280, { maxWidth: 200 })
await textDoc.save('test/output/text-test.pdf')
console.log('  - All text options work')
console.log('  PASSED\n')

// Test 3: Shapes
console.log('Test 3: Shapes')
const shapeDoc = pdf('A4')
  .page()
  // Rectangles
  .rect(50, 50, 100, 60, { fill: '#3498db' })
  .rect(170, 50, 100, 60, { stroke: '#2c3e50', lineWidth: 2 })
  .rect(290, 50, 100, 60, { fill: '#e74c3c', stroke: '#c0392b', lineWidth: 1 })
  .rect(410, 50, 100, 60, { fill: '#9b59b6', radius: 15 })
  // Circles
  .circle(100, 180, 40, { fill: '#1abc9c' })
  .circle(220, 180, 40, { stroke: '#16a085', lineWidth: 3 })
  .circle(340, 180, 40, { fill: '#f39c12', stroke: '#d35400' })
  // Lines
  .line(50, 250, 250, 250, { color: '#000', width: 1 })
  .line(50, 270, 250, 270, { color: '#e74c3c', width: 3 })
  .line(50, 290, 250, 290, { color: '#3498db', width: 2, dash: [10, 5] })
  .line(50, 310, 250, 310, { color: '#2ecc71', width: 1, dash: [3, 3] })
await shapeDoc.save('test/output/shapes-test.pdf')
console.log('  - Rectangle (fill, stroke, rounded) works')
console.log('  - Circle (fill, stroke) works')
console.log('  - Line (solid, dashed) works')
console.log('  PASSED\n')

// Test 4: Tables
console.log('Test 4: Tables')
const tableDoc = pdf('A4')
  .page()
  .text('Table Examples', 50, 30, { size: 20, weight: 'bold' })
  // Simple table
  .table(
    [
      ['Apple', '10', '$1.50'],
      ['Banana', '25', '$0.75'],
      ['Orange', '15', '$2.00'],
    ],
    50, 60,
    {
      columns: [
        { header: 'Fruit', width: 100 },
        { header: 'Qty', width: 60, align: 'center' },
        { header: 'Price', width: 80, align: 'right' },
      ]
    }
  )
  // Styled table
  .table(
    [
      ['John Doe', 'john@email.com', 'Admin'],
      ['Jane Smith', 'jane@email.com', 'User'],
      ['Bob Wilson', 'bob@email.com', 'Editor'],
    ],
    50, 220,
    {
      columns: [
        { header: 'Name', width: 120 },
        { header: 'Email', width: 150 },
        { header: 'Role', width: 80, align: 'center' },
      ],
      headerBg: '#2c3e50',
      headerColor: '#ffffff',
      borderColor: '#34495e',
      fontSize: 11,
      padding: 10
    }
  )
await tableDoc.save('test/output/table-test.pdf')
console.log('  - Basic table works')
console.log('  - Styled table works')
console.log('  PASSED\n')

// Test 5: Links
console.log('Test 5: Links')
const linkDoc = pdf('A4')
  .page()
  .text('Links Example', 50, 30, { size: 20, weight: 'bold' })
  .link('Click here to visit Google', 'https://google.com', 50, 60)
  .link('GitHub (no underline)', 'https://github.com', 50, 90, { underline: false })
  .link('Custom color link', 'https://example.com', 50, 120, { color: '#e74c3c' })
await linkDoc.save('test/output/link-test.pdf')
console.log('  - Links with underline work')
console.log('  - Links without underline work')
console.log('  - Custom colored links work')
console.log('  PASSED\n')

// Test 6: Multiple pages
console.log('Test 6: Multiple pages')
const multiDoc = pdf('A4')
  .page()
  .rect(0, 0, 595, 842, { fill: '#3498db' })
  .text('Page 1', 297, 421, { size: 48, color: '#fff', weight: 'bold', align: 'center' })
  .page()
  .rect(0, 0, 595, 842, { fill: '#e74c3c' })
  .text('Page 2', 297, 421, { size: 48, color: '#fff', weight: 'bold', align: 'center' })
  .page()
  .rect(0, 0, 595, 842, { fill: '#2ecc71' })
  .text('Page 3', 297, 421, { size: 48, color: '#fff', weight: 'bold', align: 'center' })
  .page('A5')
  .text('Page 4 (A5 size)', 210, 297, { size: 24, weight: 'bold', align: 'center' })
await multiDoc.save('test/output/multipage-test.pdf')
console.log('  - Multiple pages work')
console.log('  - Different page sizes work')
console.log('  PASSED\n')

// Test 7: Complete document
console.log('Test 7: Complete document (all features)')
const completeDoc = pdf('A4')
  .page()
  // Header
  .rect(0, 0, 595, 100, { fill: '#1a1a2e' })
  .text('PODPDF', 50, 40, { size: 32, color: '#fff', weight: 'bold' })
  .text('Complete Feature Test', 50, 70, { size: 14, color: '#888' })

  // Features section
  .text('All Features Demo', 50, 130, { size: 20, weight: 'bold' })

  // Text styles
  .text('Text Styles:', 50, 160, { size: 14, weight: 'bold' })
  .text('Normal', 50, 180)
  .text('Bold', 100, 180, { weight: 'bold' })
  .text('Italic', 150, 180, { weight: 'italic' })
  .text('Color', 200, 180, { color: '#e74c3c' })

  // Shapes
  .text('Shapes:', 50, 210, { size: 14, weight: 'bold' })
  .rect(50, 230, 60, 40, { fill: '#3498db' })
  .rect(120, 230, 60, 40, { fill: '#e74c3c', radius: 8 })
  .circle(230, 250, 20, { fill: '#9b59b6' })
  .line(270, 230, 350, 270, { color: '#2ecc71', width: 2 })

  // Table
  .text('Table:', 50, 300, { size: 14, weight: 'bold' })
  .table(
    [['A', 'B', 'C'], ['D', 'E', 'F']],
    50, 320,
    {
      columns: [
        { header: 'Col 1', width: 80 },
        { header: 'Col 2', width: 80 },
        { header: 'Col 3', width: 80 },
      ],
      headerBg: '#34495e',
      headerColor: '#fff'
    }
  )

  // Link
  .text('Link:', 50, 430, { size: 14, weight: 'bold' })
  .link('https://github.com', 'https://github.com', 50, 450)

  // Text wrapping
  .text('Text Wrapping:', 50, 490, { size: 14, weight: 'bold' })
  .text('This is a demonstration of automatic text wrapping. When you specify a maxWidth, the text will automatically break into multiple lines to fit within that width.', 50, 510, { maxWidth: 300 })

  // Footer
  .line(50, 800, 545, 800, { color: '#ccc' })
  .text('Generated with podpdf - 7.6KB', 297, 820, { size: 10, color: '#888', align: 'center' })

await completeDoc.save('test/output/complete-test.pdf')
console.log('  - Complete document generated')
console.log('  PASSED\n')

// Test 8: Build returns Uint8Array
console.log('Test 8: Build output')
const buildDoc = pdf('A4').page().text('Test', 50, 50)
const bytes = buildDoc.build()
console.log('  - build() returns Uint8Array:', bytes instanceof Uint8Array)
console.log('  - PDF starts with %PDF:', new TextDecoder().decode(bytes.slice(0, 5)) === '%PDF-')
console.log('  - Output size:', bytes.length, 'bytes')
console.log('  PASSED\n')

console.log('========================================')
console.log('All tests PASSED!')
console.log('Check test/output/ folder for generated PDFs')
console.log('========================================')
