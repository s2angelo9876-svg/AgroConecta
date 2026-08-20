/**
 * QR decorativo para el demo de pagos (no codifica datos reales).
 * Genera un patrón determinista a partir de un texto semilla.
 */
export default function FakeQR({ seed }: { seed: string }) {
  const size = 21;
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const rand = () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    h >>>= 0;
    return h / 4294967295;
  };

  const inFinder = (x: number, y: number) =>
    (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7);

  const finderCell = (x: number, y: number) => {
    const fx = x < 7 ? x : x - (size - 7);
    const fy = y < 7 ? y : y - (size - 7);
    const border = fx === 0 || fx === 6 || fy === 0 || fy === 6;
    const center = fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4;
    return border || center;
  };

  const cells = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dark = inFinder(x, y) ? finderCell(x, y) : rand() > 0.5;
      cells.push(
        <div
          key={`${x}-${y}`}
          className={`aspect-square ${dark ? "bg-stone-900" : "bg-white"}`}
        />
      );
    }
  }

  return (
    <div
      className="mx-auto grid w-40 overflow-hidden rounded-lg border-4 border-white bg-white shadow-md"
      style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      aria-hidden
    >
      {cells}
    </div>
  );
}
