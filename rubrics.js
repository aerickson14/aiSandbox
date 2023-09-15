const rubrics = { }

async function fetchRubric(name) {
  const response = await fetch(`rubrics/${name}.txt`)
  const text = await response.text()
  return { name, text }
}

export function getRubric(name) {
  return rubrics[name]
}

export async function init() {
  const response = await fetch('rubrics/all.txt')
  const rubricNamesText = await response.text()
  const rubricNames = rubricNamesText.trim().split('\n').map(name => name.trim())
  const rubricInfos = await Promise.all(rubricNames.map(fetchRubric))
  console.log("FETCHED", rubricInfos)
  for (const rubricInfo of rubricInfos) {
    rubrics[rubricInfo.name] = rubricInfo.text
  }
  console.log("RESOLVED Rubrics", rubrics)
}
  