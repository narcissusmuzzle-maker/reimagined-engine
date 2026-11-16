import assert from 'node:assert'
import * as lay from '../shared/layout.js'

let n = 0
function t(name, f) { f(); n++; console.log('ok  ' + name) }

t('верхние края полосок как в описании: 48, 102, 178, 236, 294, 352, 410, 468', () => {
  assert.deepEqual(lay.specLayout().bars.map((b) => b.y), [48, 102, 178, 236, 294, 352, 410, 468])
})

t('высоты: две верхние по 36, шесть нижних по 26', () => {
  assert.deepEqual(lay.specLayout().bars.map((b) => b.h), [36, 36, 26, 26, 26, 26, 26, 26])
})

t('нижний край последней полоски 494, снизу остаётся 20 px', () => {
  assert.equal(lay.specBottom(), 494)
  assert.equal(514 - lay.specBottom(), 20)
})

t('эмодзи: центр x = 216, размер 24, низ эмодзи за 2 px до полоски', () => {
  const s = lay.specLayout()
  assert.equal(s.emoji.length, 6)
  for (let k = 0; k < 6; k++) {
    const e = s.emoji[k]
    assert.equal(e.x + e.size / 2, 216)
    assert.equal(e.size, 24)
    assert.equal(s.bars[2 + k].y - (e.y + e.size), 2)
  }
})

t('расстояния: полоска 1 -> 2 = 18, полоска 2 -> первое эмодзи = 14, низ полоски -> следующее эмодзи = 6', () => {
  const s = lay.specLayout()
  assert.equal(s.bars[1].y - (s.bars[0].y + s.bars[0].h), 18)
  assert.equal(s.emoji[0].y - (s.bars[1].y + s.bars[1].h), 14)
  for (let k = 0; k < 5; k++) assert.equal(s.emoji[k + 1].y - (s.bars[2 + k].y + s.bars[2 + k].h), 6)
})

t('три сегмента: от x = 26 до x = 406, зазоры по 3 px, ширина ≈124', () => {
  const g = lay.segments()
  assert.equal(g.length, 3)
  assert.equal(g[0].x, 26)
  assert.equal(g[2].x + g[2].w, 406)
  assert.equal(g[1].x - (g[0].x + g[0].w), 3)
  assert.equal(g[2].x - (g[1].x + g[1].w), 3)
  for (const s of g) assert.ok(s.w >= 124 && s.w <= 125)
})

t('на странице: тот же сдвиг, что в «Таймере» (DOWN = 33, подъём на 31 px)', () => {
  const p = lay.pageLayout(33)
  assert.deepEqual(p.bars.map((b) => b.y), [17, 71, 147, 205, 263, 321, 379, 437])
  assert.equal(p.bottom, 463)
  assert.equal(p.top, 17)
  assert.equal(p.emoji[0].y, 121)
})

t('DOWN = 64 — без подъёма (как в описании), DOWN = 16 — максимальный подъём без ухода выше страницы', () => {
  assert.equal(lay.pageLayout(64).bars[0].y, 48)
  assert.equal(lay.pageLayout(16).bars[0].y, 0)
})

t('расстояния между полосками и эмодзи на странице те же, что в описании', () => {
  const s = lay.specLayout()
  const p = lay.pageLayout(33)
  for (let i = 0; i < 8; i++) assert.equal(s.bars[i].y - p.bars[i].y, 31)
  for (let i = 0; i < 6; i++) assert.equal(s.emoji[i].y - p.emoji[i].y, 31)
})

console.log(n + ' проверок пройдено')
