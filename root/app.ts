import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import { CoinAPI } from "./src/api/coinMarketAPI.js";
import { TelegramAPI } from "./src/api/telegramAPI.js";
import { DatabaseAPI } from "./src/api/databaseAPI.js";
import { Callback, Request } from "./src/interfaces/request-interface.js";

dotenv.config();
mongoose.connect(process.env.DATABASE_URL!);

const app = express();
app.use(express.json());

function main() {
    const symbolArr: string[] = [];
    const deleteCryptoArr: string[] = [];
    const addCryptoArr: string[] = [];
    const coinAPI = new CoinAPI();
    const telegramAPI = new TelegramAPI();
    const databaseAPI = new DatabaseAPI();

    app.post("/", async (req, res) => {
        const chatId =
      (req.body as Request).message?.chat.id ||
      (req.body as Callback).callback_query.message.chat.id;
        const receivedMessage = (req.body as Request).message?.text;
        const userName = (req.body as Request).message?.from.username;

        if (receivedMessage === "/start") {
            await databaseAPI.createUser(userName);

            const text = `Hello, ${
                (req.body as Request).message.from.first_name || "my friend"
            }! Type /help to see what I can!`;

            await telegramAPI.sendAnswer(text, chatId, res);
        } else if (receivedMessage === "/help") {
            const text =
        "I'm a crypto bot!! I can provide you with crypto information! I support such commands:\n" +
        "/listRecent\n/listFavorite\n/addToFavorite {currency name}\n/deleteFavorite {currency name}";

            await telegramAPI.sendAnswer(text, chatId, res);
        } else if (receivedMessage === "/listRecent") {
            const data = await coinAPI.getCryptoList();

            data.forEach(
                (crypto) =>
                    symbolArr.includes(`/${crypto.symbol}`) ||
          symbolArr.push(`/${crypto.symbol}`)
            );
            data.forEach(
                (crypto) =>
                    deleteCryptoArr.includes(`/deleteFavorite ${crypto.symbol}`) ||
          deleteCryptoArr.push(`/deleteFavorite ${crypto.symbol}`)
            );
            data.forEach(
                (crypto) =>
                    addCryptoArr.includes(`/addToFavorite ${crypto.symbol}`) ||
          addCryptoArr.push(`/addToFavorite ${crypto.symbol}`)
            );

            const text = data
                .map(
                    (crypto) => `/${crypto.symbol} $${crypto.quote.USD.price.toFixed(2)}`
                )
                .join("\n");

            await telegramAPI.sendAnswer(text, chatId, res);
        } else if (symbolArr.includes(receivedMessage)) {
            const userObj = await databaseAPI.getUser(userName);
            const symbol = receivedMessage.slice(1);
            const cryptoData = await coinAPI.getCryptoBySymbol(symbol);
            const text = telegramAPI.currencyString(cryptoData[symbol]);

            await telegramAPI.sendCurrencyData(text, chatId, res, userObj, symbol);
        } else if ((req.body as Callback).callback_query) {
            const messageId = (req.body as Callback).callback_query.message
                .message_id;
            const userName = (req.body as Callback).callback_query.from.username;
            const cryptoSymbol = (req.body as Callback).callback_query.data;
            const text = `${cryptoSymbol} is processed!`;
            const { cryptos } = await databaseAPI.getUser(userName);

            cryptos.includes(cryptoSymbol)
                ? cryptos.splice(cryptos.indexOf(cryptoSymbol), 1)
                : cryptos.push(cryptoSymbol);

            await databaseAPI.updateUserData(userName, cryptos);

            await telegramAPI.processButton(text, chatId, res, messageId);
        } else if (deleteCryptoArr.includes(receivedMessage)) {
            const cryptoSymbol = receivedMessage.slice(
                receivedMessage.indexOf(" ") + 1
            );
            const { cryptos } = await databaseAPI.getUser(userName);
            const text = cryptos.includes(cryptoSymbol)
                ? `${cryptoSymbol} deleted from favorite!`
                : `${cryptoSymbol} is not in favorite.`;

            cryptos.includes(cryptoSymbol) &&
        cryptos.splice(cryptos.indexOf(cryptoSymbol), 1);

            await databaseAPI.updateUserData(userName, cryptos);

            await telegramAPI.sendAnswer(text, chatId, res);
        } else if (addCryptoArr.includes(receivedMessage)) {
            const cryptoSymbol = receivedMessage.slice(
                receivedMessage.indexOf(" ") + 1
            );
            const { cryptos } = await databaseAPI.getUser(userName);
            const text = !cryptos.includes(cryptoSymbol)
                ? `${cryptoSymbol} added to favorite!`
                : `${cryptoSymbol} is already in favorite.`;

            cryptos.includes(cryptoSymbol) || cryptos.push(cryptoSymbol);

            await databaseAPI.updateUserData(userName, cryptos);

            await telegramAPI.sendAnswer(text, chatId, res);
            return;
        } else if (
            receivedMessage === "/deleteFavorite" ||
      receivedMessage === "/addToFavorite"
        ) {
            const text = "You should enter currency name!";

            await telegramAPI.sendAnswer(text, chatId, res);
            return;
        } else if (
            receivedMessage.startsWith("/deleteFavorite") ||
      receivedMessage.startsWith("/addToFavorite")
        ) {
            const text = "Invalid currency name.";

            await telegramAPI.sendAnswer(text, chatId, res);
            return;
        } else if (receivedMessage === "/listFavorite") {
            const { cryptos } = await databaseAPI.getUser(userName);
            const followingCryptos = await coinAPI.getCryptoBySymbol(
                cryptos.toString()
            );
            const responseArr = cryptos.map(
                (crypto) =>
                    `/${followingCryptos[crypto].symbol} $${followingCryptos[
                        crypto
                    ].quote.USD.price.toFixed(2)}`
            );
            const text =
        responseArr.length === 0
            ? "No currency in favorite!"
            : `Your favorite list:\n${responseArr.join("\n")}`;

            await telegramAPI.sendAnswer(text, chatId, res);
        } else {
            const text = "I didn't understand you, could you repeat, please?";

            await telegramAPI.sendAnswer(text, chatId, res);
        }
    });
}

main();

app.listen(80, () => {
    console.log("Server is running");
});
