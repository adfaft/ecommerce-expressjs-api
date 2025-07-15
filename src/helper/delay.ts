const delay = (seconds: number) : Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, seconds))
}

export default delay;