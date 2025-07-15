const delay = (seconds) => {
  return new Promise((resolve) => setTimeout(resolve, seconds))
}

export default delay;