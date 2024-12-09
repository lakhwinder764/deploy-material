export const randomColorGenerator = () =>
  Math.floor(Math.random() * 3) === 0
    ? 'success'
    : Math.floor(Math.random() * 3) === 1
      ? 'error'
      : Math.floor(Math.random() * 3) === 2
        ? 'primary'
        : 'primary'
