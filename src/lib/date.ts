// one month = 36 px on screen; adjust to taste
export const MONTH_HEIGHT = 36

export interface MonthPoint {
  year: number;
  month?: number;      // 1‒12  (default = 1 Jan)
}

export const toMonths = (p: MonthPoint) =>
  (p.year * 12) + ((p.month ?? 1) - 1)

export const spanInMonths = (a: MonthPoint, b: MonthPoint) =>
  toMonths(b) - toMonths(a)
