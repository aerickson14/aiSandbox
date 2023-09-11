
const chatLines = []
const transcript = document.getElementById('transcript')

function pushTranscript(role, html) {
  transcript.insertAdjacentHTML('beforeend', `<div class="wrapper"><div class="${role}">${html}</div></div>`)
  transcript.scrollTop = transcript.scrollHeight
}

async function askChatSystem(text) {
  return `AI: ${text}`
}

async function handleChatKey(event, input) {

  const key = event.key ?? 'Enter'
  if (key !== 'Enter') {
    return
  }
  
  const text = input.value.trim()
  
  if (!text) {
    return
  }
  if (text.trim().startsWith('/')) {
    handleSlashCommand(text)
    textinput.value = ""
    return
  }

  chatLines.push({ role: "user", content: text })
  textinput.value = ""

  const answer = await askChatSystem(text)
  if (answer) {
    chatLines.push({ role: "assistant", content: answer })
    pushTranscript('assistant', answer)
  }


}

document.getElementById('chat-input').addEventListener('keyup', handleChatKey)
