const prompts = { }


async function fetchState(name) {
  const response = await fetch(`states/${name}.txt`)
  const text = await response.text()
  return text
}

directiveAdders = {
  description: (directives, info) => directives.description = info,
  outlets: (directives, info) => directives.outlets = info,
  param: (directives, info) => {
    const params = directives.params ?? { }
    const [match, name, description] = info.split(/([a-zA-Z]*)\s+(.*)/)
    params[name] = description
  },
}

function addDirective(directives, type, info) {
  directiveAdders[type](directives, info)
}

function parseStateText(text) {
  const lines = text.split('\n')
  const directiveLines = lines.filter(line => line.match(/^[a-zA-Z]*:/))
  const prompt = lines.filter(line => !line.match(/^[a-zA-Z]*:/)).join('\n')
  const directives = { }
  for (const directiveLine of directiveLines) {
    const [match, type, info] = directiveLine.match(/(^[a-zA-Z]*):\s*(.*)$/)
    addDirective(directives, type, info)
  }
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



{
  "functions": [
    {
      "name": "calculate",
      "description": "Calculate or evaluate the numeric value of an expression",
      "parameters": {
        "type": "object",
        "properties": {
          "expression": {
            "type": "string",
            "description": "The expression in javascript syntax"
          },
          "latex": {
            "type": "string",
            "description": "The expression in latex syntax for display purposes"
          },
          "explanation": {
            "type": "string",
            "description": "Plain text explaining the expression and justifying its use"
          }
        },
        "required": ["expression", "latex", "explanation"]
      }
    }
  ],
  "function_call": "auto"
}