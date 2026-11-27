
module.exports = async (req, res) => {
  const { reqHandler } = await import(
    '../dist/Ecommerce-fresh-cart/server/server.mjs'
  );

  return reqHandler(req, res);
};
