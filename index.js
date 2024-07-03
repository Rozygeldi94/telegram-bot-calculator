import "dotenv/config";
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
const keep_alive = require('./keep_alive.js')

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

let text = "";
let text2 = "";
const operators = ["+", "-", "/", "*"];
let isOperatorSelected = false;
let prevMessagesId = null;
let chatId = null;

const gameOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: "1", callback_data: "1" },
        { text: "2", callback_data: "2" },
        { text: "3", callback_data: "3" },
        { text: "+", callback_data: "+" },
      ],
      [
        { text: "4", callback_data: "4" },
        { text: "5", callback_data: "5" },
        { text: "6", callback_data: "6" },
        { text: "-", callback_data: "-" },
      ],
      [
        { text: "7", callback_data: "7" },
        { text: "8", callback_data: "8" },
        { text: "9", callback_data: "9" },
        { text: "*", callback_data: "*" },
      ],
      [
        { text: "0", callback_data: "0" },
        { text: "=", callback_data: "=" },
        { text: "/", callback_data: "/" },
      ],
    ],
  }),
};

bot.start((ctx) => {
  chatId = ctx.chat.id;
  console.log(chatId);
  ctx
    .reply(
      "Salam, menÿudan gysga ÿol saÿlap ÿada /kalkulyator diyip yazyp mini kalkulyatory ulanyp bilersiniz!"
    )
    .then(({ message_id }) => {
      console.log(message_id);
      prevMessagesId = message_id;
    });
});
/* 
bot.on("message", async (ctx) => {
  const chatId = ctx.chat.id;

  if (ctx.message.text == "menu") {
    console.log("OOO");
    // showMenu(bot, chatId);
  } else if (ctx.message.location) {
    let weather = await getWeather(ctx);
    ctx.reply(weather);
  } else if (ctx.message.text == "Получить мем кота") {
    let cat = await getCat();
    ctx.reply(cat);
  } else {
    closeMenu(bot, chatId);
  } 
});*/

bot.telegram.setMyCommands([
  {
    command: "oziniz_hakda",
    description: "Öziñiz hakda öwreniñ",
  },

  {
    command: "kalkulyator",
    description: "Mini kalkulÿator",
  },
]);

bot.on(message("sticker"), (ctx) => ctx.reply("👍"));

bot.hears("salam", (ctx) => ctx.reply("aleykim salam, nahili gowmsynyz"));
bot.hears("ozin nahili", (ctx) =>
  ctx.reply("ayy ozimem gowy, bir botun nastrayenyasy))")
);
bot.hears("name etyan", (ctx) => ctx.reply("oynap otyrn)"));
bot.hears("adyn name", (ctx) =>
  ctx.reply("adym RoHa bot, Rozygeldi tarapyndan duzuldum.))")
);
bot.hears("nireli sen", (ctx) => ctx.reply("programmirleme dunyasinden:)"));
bot.hears("yashyn nache", (ctx) => ctx.reply("mende yash bolmayar, men bot))"));

bot.on(message("text"), async (ctx) => {
  if (ctx.message.text === "/kalkulyator") {
    text = "";
    await ctx.telegram.sendMessage(ctx.message.chat.id, `Sayla`, gameOptions);
  }
  if (ctx.message.text === "/oziniz_hakda") {
    if (ctx.update.message?.from.first_name) {
      await ctx.telegram.sendMessage(
        ctx.message.chat.id,
        `Siziñ adyñyz: ${ctx.update.message?.from.first_name}`
      );
      await ctx.telegram.sendMessage(
        ctx.message.chat.id,
        `Siziñ loginiñiz: ${ctx.update.message.from.username}`
      );
    }
  }
});

const calculateOperators = {
  "+": function (a, b) {
    const number = a + b;
    return number;
  },
  "-": function (a, b) {
    if (a - b <= 0) {
      const number = a - b;
      return number;
    } else {
      const number = a - b;
      return number;
    }
  },
  "*": function (a, b) {
    const number = a * b;
    return number;
  },
  "/": function (a, b) {
    const number = a / b;
    return number;
  },
};

bot.on("callback_query", async (ctx) => {
  let theOperator = text
    .split("")
    .filter((item) => operators.includes(item))
    .join("");

  const clickedData = ctx.callbackQuery.data;

  if (prevMessagesId) {
    ctx.deleteMessage(prevMessagesId);
    prevMessagesId = null;
  }
  if (text === "" && (operators.includes(clickedData) || clickedData === "=")) {
    await ctx.reply("san saylan!");
    return;
  }
  if (operators.includes(clickedData)) {
    if (isOperatorSelected) {
      await ctx.reply("san saylan!");
    } else {
      text = text.concat(clickedData);
      text2 = text.concat(clickedData);
      await ctx.reply(text);
      isOperatorSelected = true;
    }
  } else if (clickedData === "=") {
    let indexOfTheOperator = text.indexOf(theOperator);
    let l1 = text.substring(0, indexOfTheOperator);
    let l3 = text.substring(indexOfTheOperator + 1, text.length);
    if (l1 && l3) {
      text = calculateOperators[theOperator](Number(l1), Number(l3));
      await ctx
        .replyWithHTML(
          `Jogaby: <i>${text}</i>,  (${l1}${theOperator}${l3}=${text})`
        )
        .then(({ message_id }) => {
          prevMessagesId = message_id;

          const prevMessages = Array(text2.length).fill("");
          prevMessages.forEach((item, i) => {
            ctx.deleteMessage(message_id - (i + 1));
          });
        });
      text = "";
      isOperatorSelected = false;
    } else if (!l3) {
      await ctx.reply("san saylan!");
    } else {
      await ctx.reply("san yada matematika operator saylan!");
    }
  } else {
    text = text.concat(clickedData);
    await ctx.reply(text);
  }

  await ctx.telegram.answerCbQuery(ctx.callbackQuery.id);
  await ctx.answerCbQuery();
});

bot.launch();
