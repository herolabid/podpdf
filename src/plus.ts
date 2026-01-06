// podpdf/plus - Extended PDF with PNG & Custom Fonts support
// Standalone implementation with same API as core + extra features
// Uses built-in zlib from Bun/Node (zero npm dependencies)

export type Color = string | [number, number, number]
export type Align = 'left' | 'center' | 'right'
export type Weight = 'normal' | 'bold' | 'italic' | 'bolditalic'
export interface Size { width: number; height: number }
export interface TextOpts { size?: number; color?: Color; align?: Align; weight?: Weight; maxWidth?: number; font?: string }
export interface RectOpts { fill?: Color; stroke?: Color; lineWidth?: number; radius?: number }
export interface LineOpts { color?: Color; width?: number; dash?: number[] }
export interface CircleOpts { fill?: Color; stroke?: Color; lineWidth?: number }
export interface ImageOpts { width?: number; height?: number }
export interface LinkOpts { underline?: boolean; color?: Color }
export interface TableCol { header: string; width?: number; align?: Align }
export interface TableOpts { columns: TableCol[]; headerBg?: Color; headerColor?: Color; borderColor?: Color; fontSize?: number; padding?: number }
export interface PDFMetadata { title?: string; author?: string; subject?: string; keywords?: string; creator?: string }

export const SIZES: Record<string, Size> = { A4: { width: 595, height: 842 }, A3: { width: 842, height: 1191 }, A5: { width: 420, height: 595 }, LETTER: { width: 612, height: 792 } }
const FONTS: Record<string, Record<Weight, string>> = {
  helvetica: { normal: 'Helvetica', bold: 'Helvetica-Bold', italic: 'Helvetica-Oblique', bolditalic: 'Helvetica-BoldOblique' },
  times: { normal: 'Times-Roman', bold: 'Times-Bold', italic: 'Times-Italic', bolditalic: 'Times-BoldItalic' },
  courier: { normal: 'Courier', bold: 'Courier-Bold', italic: 'Courier-Oblique', bolditalic: 'Courier-BoldOblique' }
}

const rgb = (c: Color): [number, number, number] => {
  if (Array.isArray(c)) return c
  const h = c.replace('#', '')
  if (h.length === 3) return [parseInt(h[0] + h[0], 16) / 255, parseInt(h[1] + h[1], 16) / 255, parseInt(h[2] + h[2], 16) / 255]
  return [parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255]
}
const fill = (c: Color) => { const [r, g, b] = rgb(c); return `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg` }
const stroke = (c: Color) => { const [r, g, b] = rgb(c); return `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} RG` }
const esc = (t: string) => t.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
const n = (v: number) => Number.isInteger(v) ? v.toString() : v.toFixed(2)
const measure = (t: string, s: number) => t.length * s * 0.52

// ============== PNG Support ==============

interface PNGData { w: number; h: number; rgb: Uint8Array; alpha?: Uint8Array }

const parsePNGHeader = (d: Uint8Array): { w: number; h: number; colorType: number; idat: Uint8Array } | null => {
  if (d[0] !== 0x89 || d[1] !== 0x50 || d[2] !== 0x4E || d[3] !== 0x47) return null
  let pos = 8, w = 0, h = 0, colorType = 0
  const idat: Uint8Array[] = []
  while (pos < d.length) {
    const len = (d[pos] << 24) | (d[pos+1] << 16) | (d[pos+2] << 8) | d[pos+3]
    const type = String.fromCharCode(d[pos+4], d[pos+5], d[pos+6], d[pos+7])
    if (type === 'IHDR') {
      w = (d[pos+8] << 24) | (d[pos+9] << 16) | (d[pos+10] << 8) | d[pos+11]
      h = (d[pos+12] << 24) | (d[pos+13] << 16) | (d[pos+14] << 8) | d[pos+15]
      colorType = d[pos+17]
    } else if (type === 'IDAT') idat.push(d.slice(pos+8, pos+8+len))
    else if (type === 'IEND') break
    pos += 12 + len
  }
  if (!w || !idat.length) return null
  const total = idat.reduce((a, b) => a + b.length, 0)
  const merged = new Uint8Array(total)
  let off = 0
  for (const c of idat) { merged.set(c, off); off += c.length }
  return { w, h, colorType, idat: merged }
}

const unfilterPNG = (raw: Uint8Array, w: number, h: number, colorType: number): PNGData => {
  const bpp = colorType === 6 ? 4 : colorType === 2 ? 3 : colorType === 4 ? 2 : 1
  const scanline = w * bpp + 1
  const rgb = new Uint8Array(w * h * 3)
  const alpha = (colorType === 6 || colorType === 4) ? new Uint8Array(w * h) : undefined

  const paeth = (a: number, b: number, c: number) => {
    const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c)
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c
  }

  for (let y = 0; y < h; y++) {
    const filter = raw[y * scanline]
    for (let x = 0; x < w * bpp; x++) {
      const i = y * scanline + 1 + x
      const a = x >= bpp ? raw[i - bpp] : 0
      const b = y > 0 ? raw[(y-1) * scanline + 1 + x] : 0
      const c = (x >= bpp && y > 0) ? raw[(y-1) * scanline + 1 + x - bpp] : 0

      if (filter === 1) raw[i] = (raw[i] + a) & 255
      else if (filter === 2) raw[i] = (raw[i] + b) & 255
      else if (filter === 3) raw[i] = (raw[i] + Math.floor((a + b) / 2)) & 255
      else if (filter === 4) raw[i] = (raw[i] + paeth(a, b, c)) & 255
    }

    for (let x = 0; x < w; x++) {
      const i = y * scanline + 1 + x * bpp
      const oi = (y * w + x) * 3
      if (colorType === 6) { rgb[oi] = raw[i]; rgb[oi+1] = raw[i+1]; rgb[oi+2] = raw[i+2]; if (alpha) alpha[y*w+x] = raw[i+3] }
      else if (colorType === 4) { rgb[oi] = rgb[oi+1] = rgb[oi+2] = raw[i]; if (alpha) alpha[y*w+x] = raw[i+1] }
      else if (colorType === 2) { rgb[oi] = raw[i]; rgb[oi+1] = raw[i+1]; rgb[oi+2] = raw[i+2] }
      else { rgb[oi] = rgb[oi+1] = rgb[oi+2] = raw[i] }
    }
  }
  return { w, h, rgb, alpha }
}

// ============== TTF Font Support ==============

interface TTFInfo { name: string; unitsPerEm: number; ascent: number; descent: number; bbox: number[]; widths: number[]; data: Uint8Array }

const parseTTF = (d: Uint8Array): TTFInfo | null => {
  const u16 = (o: number) => (d[o] << 8) | d[o+1]
  const i16 = (o: number) => { const v = u16(o); return v > 32767 ? v - 65536 : v }
  const u32 = (o: number) => (d[o] << 24) | (d[o+1] << 16) | (d[o+2] << 8) | d[o+3]
  const numTables = u16(4)
  const tables: Record<string, { offset: number; length: number }> = {}
  for (let i = 0; i < numTables; i++) {
    const o = 12 + i * 16
    tables[String.fromCharCode(d[o], d[o+1], d[o+2], d[o+3])] = { offset: u32(o+8), length: u32(o+12) }
  }
  if (!tables.head || !tables.hhea || !tables.hmtx || !tables.maxp) return null
  const head = tables.head.offset
  const unitsPerEm = u16(head + 18)
  const bbox = [i16(head+36), i16(head+38), i16(head+40), i16(head+42)]
  const hhea = tables.hhea.offset
  const ascent = i16(hhea + 4), descent = i16(hhea + 6), numHmtx = u16(hhea + 34)
  const hmtx = tables.hmtx.offset
  const widths: number[] = []
  for (let i = 0; i < Math.min(numHmtx, 256); i++) widths.push(u16(hmtx + i * 4))
  let name = 'CustomFont'
  if (tables.name) {
    const nt = tables.name.offset, nc = u16(nt + 2), so = nt + u16(nt + 4)
    for (let i = 0; i < nc; i++) {
      const r = nt + 6 + i * 12
      if (u16(r + 6) === 6) { name = Array.from(d.slice(so + u16(r+10), so + u16(r+10) + u16(r+8))).filter(b => b > 31 && b < 127).map(b => String.fromCharCode(b)).join(''); break }
    }
  }
  return { name: name.replace(/[^a-zA-Z0-9]/g, ''), unitsPerEm, ascent, descent, bbox, widths, data: d }
}

// ============== Stream ==============

class Stream {
  private c: Uint8Array[] = []; private s = 0; private e = new TextEncoder()
  w(d: string | Uint8Array) { const c = typeof d === 'string' ? this.e.encode(d) : d; this.c.push(c); this.s += c.length; return this }
  l(d: string) { return this.w(d + '\n') }
  size() { return this.s }
  out() { const r = new Uint8Array(this.s); let o = 0; for (const c of this.c) { r.set(c, o); o += c.length } return r }
}

// ============== Page ==============

class Page {
  w: number; h: number; c: string[] = []; f = new Set<string>()
  imgs: { d: Uint8Array; w: number; h: number; x: number; y: number; id: string; fmt: 'jpeg' | 'png'; png?: PNGData }[] = []
  links: { x: number; y: number; w: number; h: number; url: string }[] = []
  ic = 0

  constructor(s: Size) { this.w = s.width; this.h = s.height }

  text(t: string, x: number, y: number, o: TextOpts = {}) {
    const s = o.size ?? 12, wt = o.weight ?? 'normal', col = o.color ?? '#000', al = o.align ?? 'left'
    const fontFamily = o.font && FONTS[o.font] ? o.font : 'helvetica'
    const font = FONTS[fontFamily][wt]
    this.f.add(font)
    let py = this.h - y, tx = x
    const lines = o.maxWidth ? this.wrap(t, o.maxWidth, s) : [t]
    for (const ln of lines) {
      tx = al === 'center' ? x - measure(ln, s) / 2 : al === 'right' ? x - measure(ln, s) : x
      this.c.push('q', 'BT', fill(col), `/${font.replace('-', '')} ${s} Tf`, `${n(tx)} ${n(py)} Td`, `(${esc(ln)}) Tj`, 'ET', 'Q')
      py -= s * 1.2
    }
    return this
  }

  rect(x: number, y: number, w: number, h: number, o: RectOpts = {}) {
    const py = this.h - y - h; this.c.push('q')
    if (o.radius && o.radius > 0) {
      const r = Math.min(o.radius, w / 2, h / 2)
      this.c.push(`${n(x + r)} ${n(py)} m`, `${n(x + w - r)} ${n(py)} l`, `${n(x + w)} ${n(py)} ${n(x + w)} ${n(py + r)} y`, `${n(x + w)} ${n(py + h - r)} l`, `${n(x + w)} ${n(py + h)} ${n(x + w - r)} ${n(py + h)} y`, `${n(x + r)} ${n(py + h)} l`, `${n(x)} ${n(py + h)} ${n(x)} ${n(py + h - r)} y`, `${n(x)} ${n(py + r)} l`, `${n(x)} ${n(py)} ${n(x + r)} ${n(py)} y`, 'h')
    } else this.c.push(`${n(x)} ${n(py)} ${n(w)} ${n(h)} re`)
    if (o.fill) { this.c.push(fill(o.fill)); this.c.push(o.stroke ? 'B' : 'f') }
    if (o.stroke) { this.c.push(stroke(o.stroke)); if (o.lineWidth) this.c.push(`${o.lineWidth} w`); if (!o.fill) this.c.push('S') }
    this.c.push('Q'); return this
  }

  line(x1: number, y1: number, x2: number, y2: number, o: LineOpts = {}) {
    this.c.push('q')
    if (o.color) this.c.push(stroke(o.color))
    if (o.width) this.c.push(`${o.width} w`)
    if (o.dash) this.c.push(`[${o.dash.join(' ')}] 0 d`)
    this.c.push(`${n(x1)} ${n(this.h - y1)} m`, `${n(x2)} ${n(this.h - y2)} l`, 'S', 'Q')
    return this
  }

  circle(cx: number, cy: number, r: number, o: CircleOpts = {}) {
    const py = this.h - cy, k = 0.5523; this.c.push('q')
    this.c.push(`${n(cx + r)} ${n(py)} m`, `${n(cx + r)} ${n(py + r * k)} ${n(cx + r * k)} ${n(py + r)} ${n(cx)} ${n(py + r)} c`, `${n(cx - r * k)} ${n(py + r)} ${n(cx - r)} ${n(py + r * k)} ${n(cx - r)} ${n(py)} c`, `${n(cx - r * k)} ${n(py - r)} ${n(cx - r)} ${n(py - r * k)} ${n(cx)} ${n(py - r)} c`, `${n(cx + r * k)} ${n(py - r)} ${n(cx + r)} ${n(py - r * k)} ${n(cx + r)} ${n(py)} c`)
    if (o.fill) { this.c.push(fill(o.fill)); this.c.push(o.stroke ? 'B' : 'f') }
    if (o.stroke) { this.c.push(stroke(o.stroke)); if (o.lineWidth) this.c.push(`${o.lineWidth} w`); if (!o.fill) this.c.push('S') }
    this.c.push('Q'); return this
  }

  image(d: Uint8Array, x: number, y: number, o: ImageOpts = {}, png?: PNGData) {
    const info = png || this.imgInfo(d); if (!info) return this
    const w = o.width ?? info.w, h = o.height ?? info.h, id = `I${++this.ic}`
    const fmt = png ? 'png' : 'jpeg'
    this.imgs.push({ d, w: info.w, h: info.h, x, y: this.h - y - h, id, fmt, png })
    this.c.push('q', `${n(w)} 0 0 ${n(h)} ${n(x)} ${n(this.h - y - h)} cm`, `/${id} Do`, 'Q')
    return this
  }

  link(t: string, url: string, x: number, y: number, o: LinkOpts = {}) {
    const col = o.color ?? '#00E', s = 12; this.text(t, x, y, { color: col, size: s })
    const w = measure(t, s); if (o.underline !== false) this.line(x, y + 2, x + w, y + 2, { color: col, width: 0.5 })
    this.links.push({ x, y: this.h - y - s, w, h: s, url }); return this
  }

  table(data: string[][], x: number, y: number, o: TableOpts) {
    const p = o.padding ?? 8, fs = o.fontSize ?? 10, rh = fs + p * 2
    const cw = o.columns.map((c, i) => c.width ?? Math.max(measure(c.header, fs), ...data.map(r => measure(r[i] ?? '', fs))) + p * 2)
    const tw = cw.reduce((a, b) => a + b, 0); let cy = y
    this.rect(x, cy, tw, rh, { fill: o.headerBg ?? '#F0F0F0' })
    let cx = x; for (let i = 0; i < o.columns.length; i++) { const c = o.columns[i]; this.text(c.header, cx + (c.align === 'center' ? cw[i] / 2 : c.align === 'right' ? cw[i] - p : p), cy + p + fs * 0.8, { size: fs, weight: 'bold', color: o.headerColor ?? '#000', align: c.align }); cx += cw[i] }
    cy += rh
    for (let r = 0; r < data.length; r++) { this.rect(x, cy, tw, rh, { fill: r % 2 ? '#F9F9F9' : '#FFF' }); cx = x; for (let i = 0; i < o.columns.length; i++) { const c = o.columns[i]; this.text(data[r][i] ?? '', cx + (c.align === 'center' ? cw[i] / 2 : c.align === 'right' ? cw[i] - p : p), cy + p + fs * 0.8, { size: fs, align: c.align }); cx += cw[i] }; cy += rh }
    this.rect(x, y, tw, rh * (data.length + 1), { stroke: o.borderColor ?? '#CCC' }); return this
  }

  private wrap(t: string, mw: number, s: number): string[] {
    const words = t.split(' '), lines: string[] = []; let cur = ''
    for (const w of words) { const test = cur ? `${cur} ${w}` : w; if (measure(test, s) <= mw) cur = test; else { if (cur) lines.push(cur); cur = w } }
    if (cur) lines.push(cur); return lines
  }

  private imgInfo(d: Uint8Array): { w: number; h: number } | null {
    if (d[0] === 0xFF && d[1] === 0xD8) { let o = 2; while (o < d.length) { if (d[o] !== 0xFF) break; const m = d[o + 1]; if (m >= 0xC0 && m <= 0xCF && m !== 0xC4 && m !== 0xC8 && m !== 0xCC) return { h: (d[o + 5] << 8) | d[o + 6], w: (d[o + 7] << 8) | d[o + 8] }; o += 2 + ((d[o + 2] << 8) | d[o + 3]) } }
    return null
  }
}

// ============== PDFPlus Class ==============

export class PDFPlus {
  private pages: Page[] = []; private cur: Page | null = null; private sz: Size; private meta?: PDFMetadata
  private customFonts: Map<string, TTFInfo> = new Map()

  constructor(s: Size | keyof typeof SIZES = 'A4') { this.sz = typeof s === 'string' ? SIZES[s] : s }

  metadata(m: PDFMetadata) { this.meta = m; return this }

  registerFont(name: string, data: Uint8Array): this {
    const info = parseTTF(data)
    if (info) this.customFonts.set(name, info)
    return this
  }

  page(s?: Size | keyof typeof SIZES) { this.cur = new Page(s ? (typeof s === 'string' ? SIZES[s] : s) : this.sz); this.pages.push(this.cur); return this }
  text(t: string, x: number, y: number, o?: TextOpts) { this.ensure().text(t, x, y, o); return this }
  rect(x: number, y: number, w: number, h: number, o?: RectOpts) { this.ensure().rect(x, y, w, h, o); return this }
  line(x1: number, y1: number, x2: number, y2: number, o?: LineOpts) { this.ensure().line(x1, y1, x2, y2, o); return this }
  circle(cx: number, cy: number, r: number, o?: CircleOpts) { this.ensure().circle(cx, cy, r, o); return this }
  image(d: Uint8Array, x: number, y: number, o?: ImageOpts) { this.ensure().image(d, x, y, o); return this }
  link(t: string, url: string, x: number, y: number, o?: LinkOpts) { this.ensure().link(t, url, x, y, o); return this }
  table(data: string[][], x: number, y: number, o: TableOpts) { this.ensure().table(data, x, y, o); return this }

  // PNG image support (async because of zlib decompression)
  async imagePng(d: Uint8Array, x: number, y: number, o?: ImageOpts): Promise<this> {
    const header = parsePNGHeader(d)
    if (!header) return this

    // Decompress using built-in zlib
    let raw: Uint8Array
    if (typeof Bun !== 'undefined') {
      raw = Bun.inflateSync(new Uint8Array(header.idat))
    } else {
      const { inflateSync } = await import('zlib')
      raw = new Uint8Array(inflateSync(header.idat))
    }

    const png = unfilterPNG(raw, header.w, header.h, header.colorType)
    this.ensure().image(d, x, y, o, png)
    return this
  }

  private ensure() { if (!this.cur) this.page(); return this.cur! }

  build(): Uint8Array {
    const s = new Stream(), offsets: number[] = [0]
    let oid = 0

    s.l('%PDF-1.4').l('%\xB5\xB5\xB5\xB5')

    // Fonts
    const allFonts = new Set<string>(); this.pages.forEach(p => p.f.forEach(f => allFonts.add(f)))
    const fontArr = Array.from(allFonts)
    const fontIds: Record<string, number> = {}
    for (const f of fontArr) { const id = ++oid; fontIds[f] = id; offsets[id] = s.size(); s.l(`${id} 0 obj`).l(`<</Type/Font/Subtype/Type1/BaseFont/${f}>>`).l('endobj') }

    // Custom fonts (TTF)
    const customFontIds: Record<string, { fontId: number; descId: number; fileId: number }> = {}
    for (const [name, info] of this.customFonts) {
      const fileId = ++oid; offsets[fileId] = s.size()
      s.l(`${fileId} 0 obj`).l(`<</Length ${info.data.length}/Length1 ${info.data.length}>>`).l('stream')
      s.w(info.data).l('').l('endstream').l('endobj')

      const descId = ++oid; offsets[descId] = s.size()
      const scale = 1000 / info.unitsPerEm
      s.l(`${descId} 0 obj`).l(`<</Type/FontDescriptor/FontName/${info.name}/Flags 32/FontBBox[${info.bbox.map(v => Math.round(v * scale)).join(' ')}]/ItalicAngle 0/Ascent ${Math.round(info.ascent * scale)}/Descent ${Math.round(info.descent * scale)}/CapHeight ${Math.round(info.ascent * scale * 0.7)}/StemV 80/FontFile2 ${fileId} 0 R>>`).l('endobj')

      const fontId = ++oid; offsets[fontId] = s.size()
      const widthsStr = info.widths.slice(0, 256).map(w => Math.round(w * scale)).join(' ')
      s.l(`${fontId} 0 obj`).l(`<</Type/Font/Subtype/TrueType/BaseFont/${info.name}/FirstChar 0/LastChar 255/Widths[${widthsStr}]/FontDescriptor ${descId} 0 R/Encoding/WinAnsiEncoding>>`).l('endobj')

      customFontIds[name] = { fontId, descId, fileId }
    }

    // Images
    const contentIds: number[] = [], annotIds: number[][] = [], imgIds: number[][] = [], smaskIds: number[][] = []
    for (const p of this.pages) {
      const pImgIds: number[] = [], pSmaskIds: number[] = []
      for (const img of p.imgs) {
        if (img.fmt === 'png' && img.png) {
          // PNG: embed raw RGB data
          const png = img.png

          // SMask for alpha if present
          let smaskId = 0
          if (png.alpha) {
            smaskId = ++oid; pSmaskIds.push(smaskId); offsets[smaskId] = s.size()
            s.l(`${smaskId} 0 obj`).l(`<</Type/XObject/Subtype/Image/Width ${png.w}/Height ${png.h}/ColorSpace/DeviceGray/BitsPerComponent 8/Length ${png.alpha.length}>>`).l('stream')
            s.w(png.alpha).l('').l('endstream').l('endobj')
          }

          const id = ++oid; pImgIds.push(id); offsets[id] = s.size()
          s.l(`${id} 0 obj`).l(`<</Type/XObject/Subtype/Image/Width ${png.w}/Height ${png.h}/ColorSpace/DeviceRGB/BitsPerComponent 8${smaskId ? `/SMask ${smaskId} 0 R` : ''}/Length ${png.rgb.length}>>`).l('stream')
          s.w(png.rgb).l('').l('endstream').l('endobj')
        } else {
          // JPEG
          const id = ++oid; pImgIds.push(id); offsets[id] = s.size()
          s.l(`${id} 0 obj`).l(`<</Type/XObject/Subtype/Image/Width ${img.w}/Height ${img.h}/ColorSpace/DeviceRGB/BitsPerComponent 8/Filter/DCTDecode/Length ${img.d.length}>>`).l('stream')
          s.w(img.d).l('').l('endstream').l('endobj')
        }
      }
      imgIds.push(pImgIds); smaskIds.push(pSmaskIds)

      const content = p.c.join('\n'), len = new TextEncoder().encode(content).length
      const cid = ++oid; contentIds.push(cid); offsets[cid] = s.size(); s.l(`${cid} 0 obj`).l(`<</Length ${len}>>`).l('stream').w(content).l('').l('endstream').l('endobj')

      const pAnnotIds: number[] = []; for (const l of p.links) { const aid = ++oid; pAnnotIds.push(aid); offsets[aid] = s.size(); s.l(`${aid} 0 obj`).l(`<</Type/Annot/Subtype/Link/Rect[${l.x} ${l.y} ${l.x + l.w} ${l.y + l.h}]/Border[0 0 0]/A<</Type/Action/S/URI/URI(${l.url})>>>>`).l('endobj') }
      annotIds.push(pAnnotIds)
    }

    const pagesId = ++oid
    const pageStartId = oid + 1
    const pageIds = this.pages.map((_, i) => pageStartId + i)
    offsets[pagesId] = s.size()
    s.l(`${pagesId} 0 obj`).l(`<</Type/Pages/Kids[${pageIds.map(id => `${id} 0 R`).join(' ')}]/Count ${pageIds.length}>>`).l('endobj')

    for (let i = 0; i < this.pages.length; i++) {
      const p = this.pages[i], pid = ++oid
      const fRef = Array.from(p.f).map(f => `/${f.replace('-', '')} ${fontIds[f]} 0 R`).join('')
      const cfRef = Array.from(this.customFonts.keys()).map(name => `/${name} ${customFontIds[name].fontId} 0 R`).join('')
      const iRef = p.imgs.map((img, j) => `/${img.id} ${imgIds[i][j]} 0 R`).join('')
      const aRef = annotIds[i].length ? `/Annots[${annotIds[i].map(id => `${id} 0 R`).join(' ')}]` : ''
      offsets[pid] = s.size()
      s.l(`${pid} 0 obj`).l(`<</Type/Page/Parent ${pagesId} 0 R/MediaBox[0 0 ${p.w} ${p.h}]/Contents ${contentIds[i]} 0 R/Resources<<${(fRef || cfRef) ? `/Font<<${fRef}${cfRef}>>` : ''}${iRef ? `/XObject<<${iRef}>>` : ''}>>${aRef}>>`).l('endobj')
    }

    // Info dictionary
    let infoId = 0
    if (this.meta) {
      infoId = ++oid; offsets[infoId] = s.size()
      const d = new Date(), date = `D:${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}${String(d.getHours()).padStart(2,'0')}${String(d.getMinutes()).padStart(2,'0')}${String(d.getSeconds()).padStart(2,'0')}`
      const m = this.meta
      s.l(`${infoId} 0 obj`).l(`<<${m.title?`/Title(${esc(m.title)})`:''}${m.author?`/Author(${esc(m.author)})`:''}${m.subject?`/Subject(${esc(m.subject)})`:''}${m.keywords?`/Keywords(${esc(m.keywords)})`:''}${m.creator?`/Creator(${esc(m.creator)})`:''}/Producer(podpdf)/CreationDate(${date})>>`).l('endobj')
    }

    const catId = ++oid; offsets[catId] = s.size()
    s.l(`${catId} 0 obj`).l(`<</Type/Catalog/Pages ${pagesId} 0 R>>`).l('endobj')

    const xref = s.size()
    s.l('xref').l(`0 ${oid + 1}`).l('0000000000 65535 f ')
    for (let i = 1; i <= oid; i++) s.l(`${offsets[i].toString().padStart(10, '0')} 00000 n `)
    s.l('trailer').l(`<</Size ${oid + 1}/Root ${catId} 0 R${infoId?`/Info ${infoId} 0 R`:''}>>`).l('startxref').l(xref.toString()).l('%%EOF')
    return s.out()
  }

  async save(path: string) { const d = this.build(); if (typeof Bun !== 'undefined') await Bun.write(path, d); else { const { writeFile } = await import('fs/promises'); await writeFile(path, d) } }
}

export const pdfPlus = (s?: Size | keyof typeof SIZES) => new PDFPlus(s)
