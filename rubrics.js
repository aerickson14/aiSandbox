const rubrics = { }

async function fetchRubric(name) {
  const response = await fetch(`rubrics/${name}.txt`)
  const text = await response.text()
  return { name, text }
}

function parseRubricText(textInfo) {
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

export function getRubric(name) {
  return rubrics[name]
}

export async function init() {
  const response = await fetch('rubrics/all.txt')
  const rubricNamesText = await response.text()
  const rubricNames = stateNamesText.trim().split('\n').map(name => name.trim())
  const rubricInfos = await Promise.all(rubricNames.map(fetchRubric))
  console.log("FETCHED", rubricInfos)
  for (const rubricInfo of rubricInfos) {
    rubrics[rubricInfo.name] = rubricInfo.text
  }
  console.log("RESOLVED Rubrics", rubrics)
}
  