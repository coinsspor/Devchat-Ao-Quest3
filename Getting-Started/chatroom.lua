Handlers.add(
    "BroadcastDiscord",
    Handlers.utils.hasMatchingTag("Action", "BroadcastDiscord"),
    function(m)
        local userTag = m.Event or "Unknown"
        
        local x = "From_Discord_userName>>>> " .. userTag .. ": " .. (m.Data or "No message content")
        Say(x)
    end
)
