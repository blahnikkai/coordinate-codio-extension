async function testGetResponse() {
  const response = await getResponse("What's the most recent announcement?")
  const json = await response.json()
  console.log(json)
  const msg = json.message
  console.log(msg)
}

async function getResponse(question) {
  return await fetch(`https://latte.rc.ufl.edu/ask`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "course_id": "506849",
      "message": question,
    }),
  })
}

async function getCodeQuestionResponse(question, codioContext) {
  return await fetch(`https://latte.rc.ufl.edu/ask-code`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "message": question,
      "codio_context": codioContext
    }),
  })
}

async function runCodio(codioIDE, window) {
  
  codioIDE.coachBot.register("LogisticsQuestionButton", "I have a logistics question", onLogisticsQuestion)
  codioIDE.coachBot.register("CodioQuestion", "I have a code question", onCodeQuestion)

  async function onLogisticsQuestion() {
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

  async function onCodeQuestion() {
    let messages = []
    
    codioIDE.coachBot.write("Ask your question in the text input below, or type 'Quit' to quit")
    while(true) {
      
      const user_input = await codioIDE.coachBot.input()
      
      if(user_input == "Quit") {
        break;
      }
      
      const codioContext = await codioIDE.coachBot.getContext()
      console.log(codioContext)
      const bodyText = JSON.stringify({
        "message": user_input,
        "codioContext": codioContext
      })
      console.log(bodyText)

      const response = await getCodeQuestionResponse(user_input, codioContext)
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
