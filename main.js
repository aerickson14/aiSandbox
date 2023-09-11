
const chatLines = []
const transcript = document.getElementById('transcript')

function pushTranscript(role, html) {
  transcript.insertAdjacentHTML('beforeend', `<div class="wrapper"><div class="${role}">${html}</div></div>`)
  transcript.scrollTop = transcript.scrollHeight
}

async function askChatSystem(text) {
  return `AI: ${text}`
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

  const answer = await askChatSystem(text)
  if (answer) {
    chatLines.push({ role: "assistant", content: answer })
    pushTranscript('assistant', answer)
  }


}

document.getElementById('chat-input').addEventListener('keyup', handleChatKey)
