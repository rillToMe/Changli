async function runMiddlewares(ctx, middlewares) {
  let index = -1

  async function dispatch(i) {
    if (i <= index) return
    index = i

    const fn = middlewares[i]
    if (!fn) return

    await fn(ctx, () => dispatch(i + 1))
  }

  await dispatch(0)
}

module.exports = { runMiddlewares }