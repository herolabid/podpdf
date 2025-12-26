import { pdf } from './src'

const doc = pdf('A4')
  .page()
  .rect(0, 0, 595, 100, { fill: '#1a1a2e' })
  .text('PODPDF', 50, 50, { size: 36, color: '#ffffff', weight: 'bold' })
  .text('Ultra-fast PDF generation - 7.6KB', 50, 80, { size: 14, color: '#888888' })

  .text('Features', 50, 140, { size: 24, weight: 'bold' })
  .circle(60, 175, 4, { fill: '#4CAF50' })
  .text('Zero dependencies', 75, 170, { size: 12 })
  .circle(60, 195, 4, { fill: '#4CAF50' })
  .text('Fluent chainable API', 75, 190, { size: 12 })
  .circle(60, 215, 4, { fill: '#4CAF50' })
  .text('Text, shapes, images, tables, links', 75, 210, { size: 12 })
  .circle(60, 235, 4, { fill: '#4CAF50' })
  .text('Multi font weight (normal/bold/italic)', 75, 230, { size: 12 })
  .circle(60, 255, 4, { fill: '#4CAF50' })
  .text('Text wrapping support', 75, 250, { size: 12 })

  .text('Shapes Demo', 50, 300, { size: 18, weight: 'bold' })
  .rect(50, 320, 100, 60, { fill: '#e74c3c' })
  .rect(170, 320, 100, 60, { fill: '#3498db', radius: 10 })
  .circle(330, 350, 30, { fill: '#9b59b6' })
  .line(380, 320, 480, 380, { color: '#2ecc71', width: 3 })

  .text('Table Example', 50, 420, { size: 18, weight: 'bold' })
  .table(
    [
      ['podpdf', '7.6KB', 'Yes'],
      ['tinypdf', '3.3KB', 'Yes'],
      ['jspdf', '250KB', 'No'],
    ],
    50, 450,
    {
      columns: [
        { header: 'Library', width: 120 },
        { header: 'Size', width: 80, align: 'center' },
        { header: 'Zero-dep', width: 80, align: 'center' },
      ],
      headerBg: '#2c3e50',
      headerColor: '#ffffff',
      borderColor: '#bdc3c7'
    }
  )

  .link('Visit GitHub', 'https://github.com', 50, 580)

  .text('Long text with wrapping:', 50, 620, { size: 14, weight: 'bold' })
  .text('This is a very long text that will automatically wrap to multiple lines when it exceeds the maximum width specified in the options.', 50, 640, { size: 12, maxWidth: 400 })

await doc.save('example.pdf')
console.log('PDF created: example.pdf (7.6KB library)')
