const TelegramAPI = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('options')
const tokenAPI = '5307927147:AAG0NDQkH7wOym2tHpkzh5CO7DasG6waiMU'

const bot = new TelegramAPI(tokenAPI, {polling: true})

const chats = {}



const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен отгадать ее`)
    const randomNum = Math.floor(Math.random() * 10)
    chats[chatId] = randomNum
    await bot.sendMessage(chatId, 'Я загадал, отгадывай:)', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Игра для пользователя'}

    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if(text === '/start') {
            await bot.sendMessage(chatId, 'https://tlgrm.ru/_/stickers/43e/041/43e041ad-afbb-34c9-8e62-222f29474c0e/1.webp')
            return  bot.sendMessage(chatId, `Добро пожаловать, я новый BotFather 2.0`)
        }
        if(text === '/info')
        {
            return  bot.sendMessage(chatId, `Тебе зовут ${msg.from.first_name} ${msg.from.last_name} `)
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю:(')
    })

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId =msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
        } else return bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions)


    })
}

start();
