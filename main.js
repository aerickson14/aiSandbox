import * as aiStates from "./aistates.js"

const chatLines = []
const transcript = document.getElementById('transcript')
let currentSystemPrompt = { prompt: 'You are a helpful AI and answer all questions succinctly.' }

function setOpenAIToken(token) {
  localStorage.setItem('OpenAIToken', token)
}

function getOpenAIToken(token) {
  return localStorage.getItem('OpenAIToken')
}

function setSystemPrompt(prompt) {
  currentSystemPrompt = prompt
}

function setAIState(name) {
  setSystemPrompt(aiStates.getPrompt(name))
}

function pushTranscript(role, html) {
  transcript.insertAdjacentHTML('beforeend', `<div class="wrapper"><div class="${role}">${html}</div></div>`)
  transcript.scrollTop = transcript.scrollHeight
}

async function askChatSystem(text) {
  const promptObject = { role: "system", content: currentSystemPrompt.prompt }
  const messages = [ promptObject, ...chatLines ]
  const options = { 
    extras: { }
  }
  if (currentSystemPrompt.functions) {
    options.extras.functions = currentSystemPrompt.functions
    options.extras.function_call = 'auto'
  }
  const result = await callChatSystem(messages, options)
  const answer = result?.choices?.[0]?.message?.content
  return answer
}

async function callChatSystem(messages, options) {
  const extras = options.extras ?? { }
  const model = "gpt-4-0613"
  const url = "https://api.openai.com/v1/chat/completions"

  const temperature = 0.8
  const headers = {
    "Content-Type": "application/json",
    Authorization: 'Bearer ' + getOpenAIToken()
  }

  const data = {
    model,
    messages,
    ...extras,
    temperature,
  }
  const body = JSON.stringify(data)
  const response = await fetch(url, {method: 'POST', body, headers })
  const json = await response.json()
  return json
}

async function handleChatKey(event) {
  const key = event.key ?? 'Enter'
  if (key !== 'Enter') {
    return
  }
  const input = event.target
  const text = input.value.trim()
  
  if (!text) {
    return
  }
  if (text.trim().startsWith('/')) {
    handleSlashCommand(text)
    input.value = ""
    return
  }

  chatLines.push({ role: "user", content: text })
  input.value = ""
  pushTranscript('user', text)

  const answer = await askChatSystem(text)
  if (answer) {
    chatLines.push({ role: "assistant", content: answer })
    pushTranscript('assistant', answer)
  }
}

document.getElementById('chat-input').addEventListener('keyup', handleChatKey)
window.setOpenAIToken = setOpenAIToken
window.setAIState = setAIState

// For debug only
window.aiStates = aiStates
await aiStates.init()

