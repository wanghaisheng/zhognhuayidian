I notice that you often have trouble emitting markdown that includes code blocks--or at least the client I am using can't render it properly.  I have learned a trick for proper rendering:

Markdown recipe:

1. Use triple backticks to start and end the outer markdown code block and specify markdown beside your triple backticks. (Use this to start your ____ markup)

2. For the inner code block (for any code examples within your ____ section)
     a. drop a line after any heading and before starting your code block
     b. Indent the code block with 4 spaces. 
     c. Use triple backticks to start and end the inner code block.
     d. Specify the language next to your triple backticks (e.g., javascript) for syntax highlighting. plan markup.)

It is essential that you follow this guidence if I am to be able to use your output.