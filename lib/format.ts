export function formatBDT(amount: number): string {
  return `৳${Math.round(amount).toLocaleString("en-BD")}`;
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function shippingCost(area: string, subtotal: number): number {
  if (subtotal >= 3000) return 0;
  const a = area.toLowerCase();
  if (a.includes("dhaka") && !a.includes("outside")) return 60;
  return 120;
}

export function isDhaka(division: string): boolean {
  return division.trim().toLowerCase() === "dhaka";
}
