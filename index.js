async function getResponse(question) {
  return await fetch("https://localhost:5005/ask", {
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

async function main(codioIDE, window) {
  
  codioIDE.coachBot.register("QuestionButton", "I have a question", onButtonPress)

  const systemPrompt = "Help the user with their questions. The user can type 'Quit' to quit"

  async function onButtonPress() {
    
    let messages = []
    
    codioIDE.coachBot.write("Ask your question in the text input below, or type 'Quit' to quit")
    while(true) {
      
      
      const user_input = await codioIDE.coachBot.input()
      
      const response = await getResponse(user_input)
      const json = await response.json()
      const msg = json.message
      
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

main(window.codioIDE, window)

// async function testGetResponse() {
//   const response = await getResponse("What's for breakfast?")
//   const json = await response.json()
//   console.log(json)
//   const msg = json.message
//   console.log(msg)
// }

// testGetResponse()
