**DevChat to Discord Message Relay Setup Guide**
This guide explains how to set up a project that relays messages between DevChat and Discord.

**Prerequisites**
Node.js and npm: Make sure Node.js and npm are installed.
Lua: Ensure Lua is installed on your system.
Required npm Packages: Install discord.js, ws, @permaweb/aoconnect, and fs.
Step 1: Install Required Modules
Run the following command to install the necessary npm packages:


`npm install discord.js ws @permaweb/aoconnect fs`

**Step 2: Project Directory Structure**
Ensure your project directory is structured as follows:


/root/DevChat/src/
|-- capture.js
|-- index.js
|-- process.lua
|-- client.lua
|-- chatroom.lua
|-- router.lua

**Step 3: Setting Up index.js**
The index.js file configures the Discord bot and sets up message relaying from Discord to DevChat.

Key Points:
Discord Bot Token and Channel ID: Replace YOUR_DISCORD_BOT_TOKEN and YOUR_DISCORD_CHANNEL_ID with your actual Discord bot token and channel ID.
Wallet Path: Ensure the wallet path points to your .aos.json file.
Relay Message to DevChat: The function relayMessageToDevChat is used to relay messages from Discord to DevChat using the @permaweb/aoconnect library.

**Step 4: Setting Up capture.js**
The capture.js script captures messages from DevChat and sends them via WebSocket to index.js.

Key Points:
WebSocket Setup: Establishes a WebSocket connection to index.js.
DevChat Message Checking: Polls for new messages from DevChat and sends them via WebSocket.

**Step 5: Lua Files**
5.1 client.lua
Handles basic client operations such as joining rooms, sending messages, and listing available rooms.

5.2 chatroom.lua
Manages chatroom functionalities such as broadcasting messages and handling various chat events.

5.3 process.lua
Defines specific actions to be taken on receiving certain messages, such as relaying messages to Discord.

5.4 router.lua
Routes messages between different components of the system.



Step 6: Running the Project
**Start the Lua Scripts:**

Load the required Lua scripts in the aos terminal:

`.load /root/DevChat/src/router.lua`
`.load /root/DevChat/src/client.lua`
`.load /root/DevChat/src/chatroom.lua`
`.load /root/DevChat/src/process.lua`

**Register the Channel:**

Register the channel by sending a message to the router:

`ao.send({ Target = "xnkv_QpWqICyt8NpVMbfsUQciZ4wlm5DigLrfXRm8fY", Action = "Register", Name = "CoinssporRoom" })
Join the Channel:`

**Join the registered channel in the aos terminal:**

`Join("CoinssporRoom")`

**Send a Test Message:**

Send a test message to the joined channel:

`Say("Hello, this is a first test message.", "CoinssporRoom")`

**Start the WebSocket Server:**

Run the index.js script to start the WebSocket server and log in the Discord bot:

`node /root/DevChat/src/index.js`


**Start Capturing DevChat Messages:**

Run the capture.js script to start capturing messages from DevChat and sending them via WebSocket:

`node /root/DevChat/src/capture.js`

**Step 7: Testing the Setup**
**Sending a Message from DevChat:**

Use the Say command in DevChat to send a message to a room:

`Say("Hello, this is a test message.", "CoinssporRoom")`

**Receiving the Message in Discord:**

Check the specified Discord channel to see if the message appears.

**Sending a Message from Discord:**

Send a message in the specified Discord channel and check if it gets relayed to DevChat.
ConclusionBy following this guide, you will set up a fully functional message relay system between DevChat and Discord. This allows seamless communication between the two platforms, enhancing the overall chat experience.
