const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input"); // npm i input
const config = require("./config.json");
const { NewMessage } = require("telegram/events");

const apiId = config.apiID;
const apiHash = config.apiHash;
const stringSession = new StringSession(config.token); // fill this later with the value from session.save()

(async () => {
    console.log("Loading interactive example...");
    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
    });
    await client.start({
        phoneNumber: async () => await input.text("number ?"),
        password: async () => await input.text("password?"),
        phoneCode: async () => await input.text("Code ?"),
        onError: (err) => console.log(err),
    });
    console.log("You should now be connected.");
    console.log(client.session.save()); // Save this string to avoid logging in again

    const result = await client.invoke(
        new Api.channels.GetFullChannel({
            channel: config.chatID,
        })
    );
    
    const ID = result.fullChat.id.value;

    async function eventPrint(event) {
        const currenId = event.message.peerId.channelId;

        if (currenId == ID) {
            console.log(event.message.message);
        }
    }
    //adds an event handler for new messages
    client.addEventHandler(eventPrint, new NewMessage({}));
})();