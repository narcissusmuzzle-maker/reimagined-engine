/**
 * Раскладка экрана U613 Stat (чистые функции, без обращений к API часов — проверяются тестами в Node).
 *
 * Размеры — по описанию экрана 432×514: восемь полосок по 380 px (поля по 26 px), каждая из трёх сегментов с зазором 3 px.
 *  - полоски 1 и 2 без подписей: высота 36 px, между ними 18 px;
 *  - полоски 3…8 с подписью-эмодзи 24 px над каждой: эмодзи заканчивается за 2 px до полоски, высота полоски 26 px,
 *    от низа полоски до верха следующего эмодзи 6 px; от полоски 2 до первого эмодзи 14 px.
 * Все y в specLayout() — «как в описании» (первая полоска на y = 48). На страницу они переводятся через pageLayout(down) ТАК ЖЕ, как
 * в приложении «Таймер»: страница сдвинута вверх на LIFT = 64 - DOWN px (в «Таймере» DOWN = 33, LIFT = 31), то есть y страницы = y описания - LIFT.
 */
export const FULL_LIFT = 64       // полностью поднятое положение (как в «Таймере»)
export const SCREEN_W = 432
export const X0 = 26
export const BAR_W = 380
export const SEG_GAP = 3
export const SEGS = 3
export const SPEC_TOP = 48
export const TOP_H = 36
export const TOP_GAP = 18
export const LOW_H = 26
export const EMOJI_SIZE = 24
export const EMOJI_GAP = 2        // от низа эмодзи до верха полоски
export const AFTER_LOW = 6        // от низа полоски до верха следующего эмодзи
export const AFTER_TOP = 14       // от низа полоски 2 до верха первого эмодзи
export const BARS = 8
export const LABELED = 6          // подписанных полосок (3…8)

/** Три сегмента полоски: [{ x, w }]. Ширина 380 делится на три с двумя зазорами по 3 px: 125 + 125 + 124. */
export function segments() {
  const free = BAR_W - SEG_GAP * (SEGS - 1)          // 374
  const base = Math.floor(free / SEGS)               // 124
  const extra = free - base * SEGS                   // 2 — по лишнему пикселю первым сегментам
  const out = []
  let x = X0
  for (let i = 0; i < SEGS; i++) {
    const w = base + (i < extra ? 1 : 0)
    out.push({ x: x, w: w })
    x += w + SEG_GAP
  }
  return out
}

/** Полоски и эмодзи в координатах описания: { bars: [{ y, h }] (8 штук), emoji: [{ x, y, size }] (6 штук, к полоскам 3…8) }. */
export function specLayout() {
  const bars = []
  const emoji = []
  let y = SPEC_TOP
  bars.push({ y: y, h: TOP_H })
  y += TOP_H + TOP_GAP
  bars.push({ y: y, h: TOP_H })
  y += TOP_H + AFTER_TOP
  const ex = Math.round(SCREEN_W / 2 - EMOJI_SIZE / 2)   // центр эмодзи x = 216
  for (let k = 0; k < LABELED; k++) {
    emoji.push({ x: ex, y: y, size: EMOJI_SIZE })
    y += EMOJI_SIZE + EMOJI_GAP
    bars.push({ y: y, h: LOW_H })
    y += LOW_H + AFTER_LOW
  }
  return { bars: bars, emoji: emoji }
}

/** Низ последней полоски в координатах описания (494). */
export function specBottom() {
  const b = specLayout().bars
  return b[b.length - 1].y + b[b.length - 1].h
}

/** Раскладка для страницы — тот же сдвиг, что в «Таймере»: y страницы = y описания - (64 - down). down = 33 даёт сдвиг вверх на 31 px. */
export function pageLayout(down) {
  const s = specLayout()
  const dy = -(FULL_LIFT - (down | 0))
  return {
    bars: s.bars.map((b) => ({ y: b.y + dy, h: b.h })),
    emoji: s.emoji.map((e) => ({ x: e.x, y: e.y + dy, size: e.size })),
    segs: segments(),
    bottom: specBottom() + dy,
    top: SPEC_TOP + dy,
  }
}
