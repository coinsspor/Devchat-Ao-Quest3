local json = require("json")

Handlers.add(
  "Say",
  Handlers.utils.hasMatchingTag("Action", "Say"),
  function (msg)
    local fromText = msg.From
    local room = msg.Room or "default"
    ao.send({
      Target = ao.id,
      Action = "SendDiscordMsg",
      Data = msg.Data,
      Event = "Message in " .. room,
      OriginatingFrom = fromText
    })
  end
)
