async function testGetResponse() {
  const response = await getResponse("What's the most recent announcement?")
  const json = await response.json()
  console.log(json)
  const msg = json.message
  console.log(msg)
}

async function getResponse(question) {
  return await fetch(`https://localhost:5005/ask`, {
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

  async function onButtonPress() {
    
    let messages = []
    
    codioIDE.coachBot.write("Ask your question in the text input below, or type 'Quit' to quit")
    while(true) {
      
      const user_input = await codioIDE.coachBot.input()
      
      if(user_input == "Quit") {
        break;
      }

      messages.push({
        "role": "user", 
        "content": user_input,
      })

      const response = await getResponse(user_input)
      const json = await response.json()
      const msg = json.response

      messages.push({
        "role": "assistant",
        "content": msg,
      })
      
      codioIDE.coachBot.write(msg)

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
