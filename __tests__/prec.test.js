/**
 * Jest tests for the Jison parser
 * 
 */
const parse = require("../src/parser.js").parse;

describe('Prec Tests', () => {
  describe('Test para numeros Enteros', () => {
    test('Multiplicacion y Division antes de Suma y Resta', () => {
      expect(parse("2 + 3 * 4")).toBe(14); // 2 + (3 * 4) = 14
      expect(parse("10 - 6 / 2")).toBe(7); // 10 - (6 / 2) = 7
      expect(parse("5 * 2 + 3")).toBe(13); // (5 * 2) + 3 = 13
      expect(parse("20 / 4 - 2")).toBe(3); // (20 / 4) - 2 = 3
    });

    test('Exponente antes de Multiplicacion, Division, Suma y Resta', () => {
      expect(parse("2 + 3 ** 2")).toBe(11); // 2 + (3 ** 2) = 11
      expect(parse("2 * 3 ** 2")).toBe(18); // 2 * (3 ** 2) = 18
      expect(parse("10 - 2 ** 3")).toBe(2); // 10 - (2 ** 3) = 2
    });

      test('Exponente asociativo por la derecha', () => {
      expect(parse("2 ** 3 ** 2")).toBe(512); // 2 ** (3 ** 2) = 2 ** 9 = 512
      expect(parse("3 ** 2 ** 2")).toBe(81); // 3 ** (2 ** 2) = 3 ** 4 = 81
    });

    test('Operaciones mixtas con precedencia correcta', () => {
      expect(parse("1 + 2 * 3 - 4")).toBe(3); // 1 + (2 * 3) - 4 = 3
      expect(parse("15 / 3 + 2 * 4")).toBe(13); // (15 / 3) + (2 * 4) = 13
      expect(parse("10 - 3 * 2 + 1")).toBe(5); // 10 - (3 * 2) + 1 = 5
    });

    test('Operaciones con exponente', () => {
      expect(parse("2 ** 3 + 1")).toBe(9); // (2 ** 3) + 1 = 9
      expect(parse("3 + 2 ** 4")).toBe(19); // 3 + (2 ** 4) = 19
      expect(parse("2 * 3 ** 2 + 1")).toBe(19); // 2 * (3 ** 2) + 1 = 19
    });

    test('Operaciones basicas', () => {
      expect(parse("1 + 2 * 3")).toBe(7); // 1 + (2 * 3) = 7
      expect(parse("6 / 2 + 4")).toBe(7); // (6 / 2) + 4 = 7
      expect(parse("2 ** 2 + 1")).toBe(5); // (2 ** 2) + 1 = 5
      expect(parse("10 / 2 / 5")).toBe(1); // (10 / 2) / 5 = 1
      expect(parse("100 - 50 + 25")).toBe(75); // (100 - 50) + 25 = 75
      expect(parse("2 * 3 + 4 * 5")).toBe(26); // (2 * 3) + (4 * 5) = 26
    });
  });

  describe('Test para numeros flotantes', () => {
    test('Operaciones con flotantes', () => {
      expect(parse("2.5 + 1.5 * 2.0")).toBe(5.5); // 2.5 + (1.5 * 2) = 2.5 + 3.0 = 5.5
      expect(parse("10.0 / 2.5 - 1.2")).toBeCloseTo(2.8); // (10.0 / 2.5) - 1.2 = 4.0 - 1.2 = 2.8
    });

    test('Operaciones con exponente', () => {
      // 2.0 ** (2.0 ** 0.5) ≈ 2.0 ** 1.414 ≈ 2.665
      // Si fuera por la izquierda: (2.0 ** 2.0) ** 0.5 = 4.0 ** 0.5 = 2.0
      const result = parse("2.0 ** 2.0 ** 0.5");
      expect(result).not.toBe(2.0);
      expect(result).toBeCloseTo(2.665, 3);
    });

    test('Operaciones con notación científica', () => {
      expect(parse("2e2 * 3 + 100")).toBe(700); // (2e2 * 3) + 100 = 600 + 100 = 700
      expect(parse("1e3 / 10 ** 2")).toBe(10); // 1e3 / 10 ** 2 = 1000 / 100 = 10
    });
  });
});