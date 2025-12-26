import { pdf } from '../src'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
const sales = [12500, 15800, 14200, 18900, 22100, 25600]
const maxSale = Math.max(...sales)
const totalSales = sales.reduce((a, b) => a + b, 0)

const doc = pdf('A4')
  .page()

  // Header
  .rect(0, 0, 595, 70, { fill: '#2c3e50' })
  .text('SALES REPORT', 50, 30, { size: 24, color: '#fff', weight: 'bold' })
  .text('Q1-Q2 2024', 50, 50, { size: 12, color: '#bdc3c7' })
  .text('Tech Solutions Inc.', 545, 40, { size: 11, color: '#95a5a6', align: 'right' })

  // Summary Cards
  .rect(50, 90, 150, 60, { fill: '#3498db', radius: 8 })
  .text('Total Revenue', 125, 108, { size: 9, color: '#fff', align: 'center' })
  .text('$' + totalSales.toLocaleString(), 125, 130, { size: 20, color: '#fff', weight: 'bold', align: 'center' })

  .rect(220, 90, 150, 60, { fill: '#2ecc71', radius: 8 })
  .text('Growth', 295, 108, { size: 9, color: '#fff', align: 'center' })
  .text('+104.8%', 295, 130, { size: 20, color: '#fff', weight: 'bold', align: 'center' })

  .rect(390, 90, 150, 60, { fill: '#9b59b6', radius: 8 })
  .text('Avg Monthly', 465, 108, { size: 9, color: '#fff', align: 'center' })
  .text('$' + Math.round(totalSales / 6).toLocaleString(), 465, 130, { size: 20, color: '#fff', weight: 'bold', align: 'center' })

  // Chart
  .text('Monthly Sales Trend', 50, 180, { size: 14, weight: 'bold' })
  .line(70, 340, 70, 200, { color: '#eee', width: 1 })
  .line(70, 340, 520, 340, { color: '#eee', width: 1 })

for (let i = 0; i < months.length; i++) {
  const x = 90 + i * 70
  const barHeight = (sales[i] / maxSale) * 120
  const y = 340 - barHeight

  doc
    .rect(x, y, 50, barHeight, { fill: '#3498db', radius: 3 })
    .text(months[i], x + 25, 355, { size: 9, align: 'center', color: '#666' })
    .text('$' + (sales[i] / 1000).toFixed(1) + 'k', x + 25, y - 12, { size: 8, align: 'center', color: '#333' })
}

doc
  // Data Table
  .text('Detailed Breakdown', 50, 390, { size: 14, weight: 'bold' })
  .table(
    [
      ['January', '45', '$12,500', '+0%'],
      ['February', '58', '$15,800', '+26.4%'],
      ['March', '52', '$14,200', '-10.1%'],
      ['April', '71', '$18,900', '+33.1%'],
      ['May', '85', '$22,100', '+16.9%'],
      ['June', '98', '$25,600', '+15.8%'],
    ],
    50, 410,
    {
      columns: [
        { header: 'Month', width: 100 },
        { header: 'Orders', width: 70, align: 'center' },
        { header: 'Revenue', width: 100, align: 'right' },
        { header: 'Change', width: 80, align: 'center' },
      ],
      headerBg: '#34495e',
      headerColor: '#fff',
      borderColor: '#ddd',
      fontSize: 10,
      padding: 8
    }
  )

  // Key Insights
  .rect(50, 610, 495, 70, { fill: '#fef9e7', radius: 5 })
  .text('Key Insights', 65, 628, { size: 11, weight: 'bold', color: '#d4ac0d' })
  .text('Best month: June ($25,600) | Avg growth: 16.4%/month | Orders: 45 to 98 (+117.8%)', 65, 648, { size: 10 })
  .text('Recommendation: Focus on Q3 marketing to maintain momentum', 65, 665, { size: 10, color: '#666' })

  // Footer
  .line(50, 710, 545, 710, { color: '#eee' })
  .text('Generated with podpdf', 297, 730, { size: 9, color: '#aaa', align: 'center' })

await doc.save('samples/report-demo.pdf')
console.log('Created: samples/report-demo.pdf')
