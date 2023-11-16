const TelegramApi = require("node-telegram-bot-api");
const axios = require("axios");
const express = require("express");
const path = require("path");
const fs = require("fs");
const https = require('https');

const app = express();

const PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.get("/frame", (req, res) => {
  res.render("index");
});

const token = "6620448857:AAHRXIDH3_ixHUN94Zhbx8HhIQdcPW9ZdXg";

const bot = new TelegramApi(token, { polling: true });

bot.setMyCommands([
  { command: "/films", description: "Фильмы" },
  { command: "/serials", description: "Сериалы" }
]);

bot.onText(/\/films/, async (msg) => {
  const userId = msg.from.id;
  let user = "";
  user += `${userId} \n`;
  fs.appendFileSync("newuser.txt", user, (err) => {
    if (err) console.log("err");
  });
  bot.sendMessage(msg.chat.id, "Введите название фильма:");
  bot.once("message", (filmMsg) => {
    const filmTitle = filmMsg.text;
    axiosGet(filmTitle, "movie", msg.chat.id);
  });
});
bot.onText(/\/serials/, (msg) => {
  const userId = msg.from.id;
  let user = "";
  user += `${userId} \n`;
  fs.appendFileSync("newuser.txt", user, (err) => {
    if (err) console.log("err");
  });
  bot.sendMessage(msg.chat.id, "Введите название сериала:");
  bot.once("message", (serialMsg) => {
    const serialTitle = serialMsg.text;
    axiosGet(serialTitle, "serial", msg.chat.id);
  });
});

const axiosReq = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
});


const axiosGet = async (item, i, chatId) => {
  let cont;
  console.log(i, "function");
  try {
    const response = await axiosReq.get("https://api.alloha.tv", {
      params: {
        token: "04941a9a3ca3ac16e2b4327347bbc1",
        order: "date",
        list: `${i}`,
        name: `${item}`,
      },
    });

    if (!response) {
      return null;
    }

    for (let j = 0; j < response.data.data.length; j++) {
      const axiosGetFrame = async (item, typeCont) => {
        let type;
        if (typeCont === "movie") {
          type = 1;
        } else {
          type = 2;
        }
        try {
          const resCdn = await axios.get(`https://videocdn.tv/api/short`, {
            params: {
              api_token: "z8CeqDyYzSGJoat6Db78dVfr06sBpdrp",
              kinopoisk_id: `${item}`,
            },
          });

          let getframeId = resCdn.data.data[0].id;

          const buttonWatch = {
            reply_markup: JSON.stringify({
              inline_keyboard: [
                [
                  {
                    text: "Смотреть",
                    url: `https://rmk99.online?id=${getframeId}&type=${type}`,
                  },
                ],
              ],
            }),
          };

          let delay = j * 1000;
          setTimeout(async () => {
            if (
              response.data.data[j].poster === null ||
              response.data.data[j].name === null ||
              response.data.data[j].year === null ||
              response.data.data[j].description === null
            ) {
              return null;
            } else {
              try {
                await bot.sendPhoto(chatId, `${response.data.data[j].poster}`, {
                  caption: `${response.data.data[j].name} - (${response.data.data[j].year})\n\n${response.data.data[j].description}`,
                });
                await bot.sendMessage(
                  chatId,
                  `${response.data.data[j].name} - (${response.data.data[j].year})`,
                  buttonWatch
                );
              } catch (error) {
                console.error(
                  "Ошибка при отправке фотографии или сообщения:",
                  error
                );
              }
            }
          }, delay);
        } catch (error) {
          console.error("Ошибка при получении данных о фильме:", error);
        }
      };

      setTimeout(() => {
        axiosGetFrame(response.data.data[j].id_kp, i);
      }, 1000 * j);
    }
  } catch (error) {
    console.error("Ошибка при выполнении запроса к API:", error);
    return null;
  }
};

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(PORT, () => {
  console.log(`run seriver on ${PORT}`);
});


