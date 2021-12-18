const Binance = require('node-binance-api');
const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");

const { logger } = require('./config/advanced/logger');
const input = require("input");
const { signalParser } = require("./middleware/signalParser.middleware");

const config = require("./config/settings.json")
const { longFormatter, shortFormatter } = require("./middleware/variables.middleware");

const binance = new Binance().options({
  APIKEY: config.binance.apiKey,
  APISECRET: config.binance.apiSecret
});

//Telegram settings
const apiId = config.telegram.apiID;
const apiHash = config.telegram.apiHash;
const stringSession = new StringSession(config.telegram.token); // fill this later with the value from session.save()

(async () => {
    try {
        const client = new TelegramClient(stringSession, apiId, apiHash, {
            connectionRetries: 25,
        });

        //Authentification
        await client.start({
            phoneNumber: async () => await input.text("number ?"),
            password: async () => await input.text("password?"),
            phoneCode: async () => await input.text("Code ?"),
            onError: (err) => console.log(err),
        });

        console.info("You should now be connected.");
        console.info("Your auth token:");
        console.info(client.session.save());

        //Get channel information
        const channelInfo = await client.invoke(
            new Api.channels.GetFullChannel({
                channel: config.telegram.chatID,
            })
        );

        //Listen udates for new messages
        client.addEventHandler((event) => {
            if (event.message.peerId.channelId == channelInfo.fullChat.id.value) {
                const messageText = event.message.message;

                const signal = signalParser(messageText, messageText.includes('Long') ? longFormatter : shortFormatter);
                console.log(signal);

            }
        }, new NewMessage({}));


    } catch (err) {
        console.error(err);
        logger.error(new Error(err));
    }
});

(async () => {
    console.info( await binance.futuresBalance() );
})();