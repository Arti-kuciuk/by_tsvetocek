export const isInStock = (product) => (product?.stock_count ?? 0) > 0;

export const sortProductsByStock = (products) =>
  [...products].sort((a, b) => {
    const aStock = isInStock(a);
    const bStock = isInStock(b);
    if (aStock === bStock) return 0;
    return aStock ? -1 : 1;
  });

export const getTopInStock = (products, limit = 4) =>
  products.filter(isInStock).slice(0, limit);
