const prompts = { }


async function fetchState(name) {
  const response = await fetch(`states/${name}.txt`)
  const text = await response.text()
  return { name, text }
}

const directiveAdders = {
  description: (directives, info) => directives.description = info,
  outlets: (directives, info) => directives.outlets = info,
  param: (directives, info) => {
    const params = directives.params ?? { }
    const [match, name, description] = info.split(/([a-zA-Z]*)\s+(.*)/)
    params[name] = description
    directives.params = params
  },
}

function addDirective(directives, type, info) {
  directiveAdders[type](directives, info)
}

function parseStateText(textInfo) {
  const { name, text } = textInfo
  const lines = text.split('\n')
  const directiveLines = lines.filter(line => line.match(/^[a-zA-Z]*:/))
  const prompt = lines.filter(line => !line.match(/^[a-zA-Z]*:/)).join('\n')
  const directives = { }
  for (const directiveLine of directiveLines) {
    const [match, type, info] = directiveLine.match(/(^[a-zA-Z]*):\s*(.*)$/)
    addDirective(directives, type, info)
  }
  return { name, directives, prompt }
}

function generateFunctions(prompts, directives) {
  const { outlets } = directives
  const outletNames = outlets.split(' ')
  const functions = []
  for (const outletName of outletNames) {
console.log("outlet", outletName)
    const outletTarget = prompts[outletName]
    const targetParams = outletTarget.params
    const properties = { }
    const required = []
    for (const targetParamName of targetParams) {
      properties[targetParamName] = {
        type: 'string',
        description: targetParams[targetParamName]
      } 
      required.push(targetParamName)
    }
console.log("required", required)

    const functionInfo = {
      name: outletName,
      description: outletTarget.description,
      parameters: {
        type: 'object',
        properties
      },
      required
    }
console.log("functionInfo", functionInfo)

    functions.push(functionInfo)
  }
  return functions
}

export async function init() {
  const response = await fetch('states/all.txt')
  const stateNamesText = await response.text()
  const stateNames = stateNamesText.trim().split('\n').map(name => name.trim())
  const stateTexts = await Promise.all(stateNames.map(fetchState))
  console.log("FETCHED", stateTexts)
  const parsedPrompts = stateTexts.map(parseStateText)
  for (const promptInfo of parsedPrompts) {
    prompts[promptInfo.name] = promptInfo
  }
  for (const name in prompts) {
    const { directives, prompt } = prompts[name]
    const functions = generateFunctions(prompts, directives)
console.log("setting functions", {promptInfo}, {functions})
    prompts[name].functions = functions
  }

  console.log("RESOLVED PROMPTS", prompts)
}

export function getPrompt(name) {
  return prompts[name]
}
