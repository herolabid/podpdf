import { pdf } from '../src'

const doc = pdf('A4')
  .page()

  // Header
  .rect(0, 0, 595, 50, { fill: '#1e3a5f' })
  .text('PODPDF - Table Examples', 50, 30, { size: 20, color: '#fff', weight: 'bold' })

  // 1. Simple Table (4 rows x 26 = 104)
  .text('1. Simple Table', 50, 75, { size: 14, weight: 'bold' })
  .table(
    [
      ['Apple', '10', '$1.50'],
      ['Banana', '25', '$0.75'],
      ['Orange', '15', '$2.00'],
    ],
    50, 95,
    {
      columns: [
        { header: 'Product', width: 100 },
        { header: 'Qty', width: 60, align: 'center' },
        { header: 'Price', width: 70, align: 'right' },
      ]
    }
  )

  // 2. Dark Header Style (4 rows x 31 = 124)
  .text('2. Dark Header Style', 300, 75, { size: 14, weight: 'bold' })
  .table(
    [
      ['John Doe', 'Admin'],
      ['Jane Smith', 'Editor'],
      ['Bob Wilson', 'Viewer'],
    ],
    300, 95,
    {
      columns: [
        { header: 'Name', width: 120 },
        { header: 'Role', width: 80, align: 'center' },
      ],
      headerBg: '#2c3e50',
      headerColor: '#ffffff',
      fontSize: 10,
      padding: 8
    }
  )

  // 3. Invoice Style (5 rows x 26 = 130)
  .text('3. Invoice Style Table', 50, 230, { size: 14, weight: 'bold' })
  .table(
    [
      ['Web Development', '40 hrs', '$100/hr', '$4,000'],
      ['UI/UX Design', '20 hrs', '$80/hr', '$1,600'],
      ['Consulting', '10 hrs', '$150/hr', '$1,500'],
      ['Maintenance', '5 hrs', '$60/hr', '$300'],
    ],
    50, 250,
    {
      columns: [
        { header: 'Description', width: 160 },
        { header: 'Hours', width: 70, align: 'center' },
        { header: 'Rate', width: 70, align: 'right' },
        { header: 'Amount', width: 90, align: 'right' },
      ],
      headerBg: '#27ae60',
      headerColor: '#fff',
      borderColor: '#1e8449',
      fontSize: 10,
      padding: 8
    }
  )

  // Total box
  .rect(300, 395, 130, 25, { fill: '#27ae60', radius: 4 })
  .text('Total: $7,400', 365, 412, { size: 12, color: '#fff', weight: 'bold', align: 'center' })

  // 4. Comparison Table (5 rows x 26 = 130)
  .text('4. Library Comparison', 50, 450, { size: 14, weight: 'bold' })
  .table(
    [
      ['podpdf', '8 KB', 'Yes', '5.5x'],
      ['jsPDF', '290 KB', 'No', '1x'],
      ['pdfkit', '1 MB', 'Yes', '0.8x'],
      ['tinypdf', '3.3 KB', 'Yes', '4x'],
    ],
    50, 470,
    {
      columns: [
        { header: 'Library', width: 90 },
        { header: 'Size', width: 80, align: 'center' },
        { header: 'Zero-dep', width: 80, align: 'center' },
        { header: 'Speed', width: 70, align: 'center' },
      ],
      headerBg: '#e74c3c',
      headerColor: '#fff',
      borderColor: '#c0392b',
      fontSize: 10,
      padding: 8
    }
  )

  // 5. Schedule Table (6 rows x 26 = 156)
  .text('5. Schedule', 50, 640, { size: 14, weight: 'bold' })
  .table(
    [
      ['09:00', 'Standup Meeting', 'Room A'],
      ['10:00', 'Code Review', 'Online'],
      ['12:00', 'Lunch Break', '-'],
      ['14:00', 'Sprint Planning', 'Room B'],
      ['16:00', 'Development', 'Desk'],
    ],
    50, 660,
    {
      columns: [
        { header: 'Time', width: 60, align: 'center' },
        { header: 'Activity', width: 130 },
        { header: 'Location', width: 80 },
      ],
      headerBg: '#3498db',
      headerColor: '#fff',
      fontSize: 10,
      padding: 6
    }
  )

  // 6. Status Table (6 rows x 22 = 132)
  .text('6. Project Status', 320, 640, { size: 14, weight: 'bold' })
  .table(
    [
      ['Auth', 'Done', '100%'],
      ['Dashboard', 'Progress', '75%'],
      ['API', 'Progress', '60%'],
      ['Testing', 'Pending', '0%'],
      ['Deploy', 'Pending', '0%'],
    ],
    320, 660,
    {
      columns: [
        { header: 'Task', width: 80 },
        { header: 'Status', width: 70, align: 'center' },
        { header: '%', width: 50, align: 'center' },
      ],
      headerBg: '#f39c12',
      headerColor: '#fff',
      fontSize: 10,
      padding: 6
    }
  )

await doc.save('samples/tables-demo.pdf')
console.log('Created: samples/tables-demo.pdf')
