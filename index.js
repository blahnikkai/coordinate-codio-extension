// Wrapping the whole extension in a JS function 
// (ensures all global variables set in this extension cannot be referenced outside its scope)
(async function(codioIDE, window) {
  
  // Refer to Anthropic's guide on system prompts here: https://docs.anthropic.com/claude/docs/system-prompts
  const systemPrompt = "Copy what the user says exactly"

  // register(id: unique button id, name: name of button visible in Coach, function: function to call when button is clicked) 
  str1 = "What is project 1 about?"
  str2 = "What is the most recent announcement?"
  codioIDE.coachBot.register("button1", str1, onButtonPress.bind(str1))
  codioIDE.coachBot.register("button2", str2, onButtonPress.bind(str2))

  // function called when I have a question button is pressed
  async function onButtonPress(question) {
    // Function that automatically collects all available context 
    // returns the following object: {guidesPage, assignmentData, files, error}
    // const context = await codioIDE.coachBot.getContext()
    // the messages object that will contain the user prompt and/or any assistant responses to be sent to the LLM
    // Refer to Anthropic's guide on the messages API here: https://docs.anthropic.com/en/api/messages
    let messages = []
    const response = await fetch("http://0.0.0.0:5005/ask", {
      method: "POST",
      body: JSON.stringify({
        "course_id": "506795",
        "message": question,
      }),
    })
    const json = await response.json()
    const msg = json.message
    // const userPrompt = "User prompt for the LLM goes here - can contain context from the object returned by getContext()"
    // Add user prompt to messages object
    messages.push({
        "role": "user", 
        "content": msg
    })
    // Send the API request to the LLM with all prompts and context 
    const result = await codioIDE.coachBot.ask({
      systemPrompt: systemPrompt,
      messages: messages
    })
    
  }
// calling the function immediately by passing the required variables
})(window.codioIDE, window)
