const prompts = { }


async function fetchState(name) {
  const response = await fetch(`states/${name}.txt`)
  const text = await response.text()
  return text
}

function parseStateText(text) {
  const lines = text.split('\n')
  const directives = lines.filter(line => line.match(/^[a-zA-Z]*:/))
  const prompt = lines.filter(line => !line.match(/^[a-zA-Z]*:/))
  return { directives, prompt }
}

export async function init() {
  const response = await fetch('states/all.txt')
  const stateNamesText = await response.text()
  const stateNames = stateNamesText.trim().split('\n').map(name => name.trim())
  const stateTexts = await Promise.all(stateNames.map(fetchState))
  console.log("FETCHED", stateTexts)
  const parsedPrompts = stateTexts.map(parseStateText)
  console.log("PARSED", parsedPrompts)
}

export function getPrompt(name) {
  return prompts[name]
}
