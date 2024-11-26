export const formatCurrency = (price: number): string =>
  new Intl.NumberFormat('id-ID', {
    currency: 'IDR'
  }).format(price);
