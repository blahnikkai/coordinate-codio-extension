async function testBasicResponse() {
  const response = await basicResponse()
  const text = await response.text()
  console.log(text.slice(0, 40))
}

async function basicResponse() {
  return await fetch("https://example.org/products.json")
}

async function testGetResponse() {
  const response = await getResponse("What's the most recent announcement?")
  const json = await response.json()
  console.log(json)
  const msg = json.message
  console.log(msg)
}

async function getResponse(question) {
  return await fetch("http://0.0.0.0:5005/ask", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "course_id": "506795",
      "message": question,
    }),
  })
}

async function runCodio(codioIDE, window) {
  
  codioIDE.coachBot.register("QuestionButton", "I have a question", onButtonPress)

  const systemPrompt = "Help the user with their questions. The user can type 'Quit' to quit"

  async function onButtonPress() {
    
    let messages = []
    
    codioIDE.coachBot.write("Ask your question in the text input below, or type 'Quit' to quit")
    while(true) {
      
      const user_input = await codioIDE.coachBot.input()

      const response = await getResponse()
      const json = await response.json()
      const msg = json.message
      await codioIDE.coachBot.write(msg)

      if(user_input == "Quit") {
        break;
      }
      
      messages.push({
          "role": "user", 
          "content": user_input,
      })
      
      const llm_response = await codioIDE.coachBot.ask(
        {
          systemPrompt: systemPrompt,
          messages: messages,
        }, 
        {
          preventMenu: true
        },
      )

      messages.push({
        "role": "assistant",
        "content": llm_response.result,
      })

      if (messages.length >= 10) {
        const removedElements = messages.splice(0, 2)
      }

    }
    codioIDE.coachBot.write("Feel free to ask some more questions whenever you want to know something!")
    codioIDE.coachBot.showMenu()
  }
}

async function main() {
  runCodio(window.codioIDE, window)
  // testGetResponse()
}

main()
