import { pdf } from '../src'

const doc = pdf('A4')
  .page()
  .rect(0, 0, 595, 100, { fill: '#1a1a2e' })
  .text('PODPDF', 50, 50, { size: 36, color: '#ffffff', weight: 'bold' })
  .text('Génération de PDF ultra-rapide - 7.6KB', 50, 80, { size: 14, color: '#888888' })

  .text('Fonctionnalités', 50, 140, { size: 24, weight: 'bold' })
  .circle(60, 175, 4, { fill: '#4CAF50' })
  .text('Zéro dépendences', 75, 170, { size: 12 })
  .circle(60, 195, 4, { fill: '#4CAF50' })
  .text('API chaînable fluide', 75, 190, { size: 12 })
  .circle(60, 215, 4, { fill: '#4CAF50' })
  .text('Texte, formes, images, tableaux, liens', 75, 210, { size: 12 })
  .circle(60, 235, 4, { fill: '#4CAF50' })
  .text('Plusieurs épaisseurs de police (normal/gras/italique)', 75, 230, { size: 12 })
  .circle(60, 255, 4, { fill: '#4CAF50' })
  .text('Prise en charge du retour à la ligne', 75, 250, { size: 12 })

  .text('Démonstration des formes', 50, 300, { size: 18, weight: 'bold' })
  .rect(50, 320, 100, 60, { fill: '#e74c3c' })
  .rect(170, 320, 100, 60, { fill: '#3498db', radius: 10 })
  .circle(330, 350, 30, { fill: '#9b59b6' })
  .line(380, 320, 480, 380, { color: '#2ecc71', width: 3 })

  .text('Exemple de tableau', 50, 420, { size: 18, weight: 'bold' })
  .table(
    [
      ['podpdf', '7.6KB', 'Yes'],
      ['tinypdf', '3.3KB', 'Yes'],
      ['jspdf', '250KB', 'No'],
    ],
    50, 450,
    {
      columns: [
        { header: 'Librairie', width: 120 },
        { header: 'Taille', width: 80, align: 'center' },
        { header: 'Zéro dep', width: 80, align: 'center' },
      ],
      headerBg: '#2c3e50',
      headerColor: '#ffffff',
      borderColor: '#bdc3c7'
    }
  )

  .link('Visiter Github', 'https://github.com', 60, 580)

  .text('Texte long avec retour à la ligne :', 60, 620, { size: 14, weight: 'bold' })
  .text("Il s'agit d'un texte très long qui passera automatiquement à la ligne lorsqu'il dépassera la largeur maximale spécifiée dans les options.", 60, 640, { size: 12, maxWidth: 400 })

  .page()

  // 1. Title
  .text("Testing Accent Support", 50, 50, { size: 24, weight: 'bold', align: 'left', color: '#333' })

  // 2. French (Accents: é, à, ê, ç)
  .text("French (Français):", 50, 100, { size: 14, weight: 'bold' })
  .text("C'est l'été ! À bientôt. Garçon, une crêpe s'il vous plaît.", 50, 120, { size: 12 })

  // 3. German (Umlauts: ä, ö, ü, ß)
  .text("German (Deutsch):", 50, 160, { size: 14, weight: 'bold' })
  .text("Heizölrückstoßabdämpfung. Übergrößen. Straße.", 50, 180, { size: 12 })

  // 4. Spanish (Accents: ñ, í, ó)
  .text("Spanish (Español):", 50, 220, { size: 14, weight: 'bold' })
  .text("El niño comió una jalapeño mañana.", 50, 240, { size: 12 })

  // 5. Mixed currencies and symbols usually supported by WinAnsi
  .text("Symbols & Currencies:", 50, 280, { size: 14, weight: 'bold' })
  .text("Price: 50£ / 45€ / $60. Copyright © 2024.", 50, 300, { size: 12 })

await doc.save('samples/accent-demo.pdf')
console.log('Created: samples/accent-demo.pdf')
