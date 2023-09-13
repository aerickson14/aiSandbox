async function fetchState(name) {
  const response = await fetch(`states/${name}.txt`)
  const text = await response.text()
  return text
}

export async function init() {
  const response = await fetch('states/all.txt')
  const stateNamesText = await response.text()
  const stateNames = stateNamesText.trim().split('\n').map(name => name.trim())
  const stateTexts = await Promise.all(stateNames.map(fetchState))
  console.log("FETCHED", stateTexts)
}
