const TelegramApi = require('node-telegram-bot-api')
const {decorOptions, techOptions, workBookOptions, workBookMoreOptions, salaryBookMoreOptions} = require('./buttonOption')
const sequelize = require('./db')
const UserModel = require('./models')
const startButtons = require('./startButtons')
const { welcomeMsg, infoMsg, sorryMsg, addressMsg, whichMsg, whichWorkBookMsg, ifCardMsg, formWorkBookMsg,
    declarationWorkBookUrl, ifCashCardMsg, declarationBillUrl, sendBillMsg, formPackageMsg, declarationPersonalDataUrl,
    applicationMsg
} = require("./messages");
require('dotenv').config()

const bot = new TelegramApi(process.env.TOKEN_BOT, { polling: true })

const connectDB = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        console.log('Connection has been established successfully.')
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
}

connectDB()


// Установка команд
bot.setMyCommands( startButtons)

// Обработка сообщений
bot.on( 'message',  async msg => {

    const isAdmin = await isUserAdmin(msg)

    const user = await getUserById(msg.chat.id)



    try {
        if (user && user.order && user.chatId === msg.chat.id && !isAdmin) {
            return await bot.sendMessage(msg.chat.id, 'Извините, но Ваша анкета уже была отправлена HR менеджеру :)')
        }


        if (msg.text === '/start') {
            if(!isAdmin && !user) {

                await userCreate(msg)

            }

            await bot.sendSticker(msg.chat.id, 'https://tlgrm.ru/_/stickers/897/df3/897df311-e19d-4a7d-8b27-4929abbcf2cc/1.webp')
            await bot.sendMessage(msg.chat.id, welcomeMsg, decorOptions)

            return

        }


        if (msg.text === '/info') {
            return await bot.sendMessage(msg.chat.id, infoMsg(msg.from))
        }

        return await bot.sendMessage(msg.chat.id, sorryMsg)
    } catch (e) {
        const users = await getAdmins()

        if (Array.isArray(users) && users.length) {
            users.every(async user => {
                    await bot.sendMessage(user.chatIdUsr, `Произошла ошибка отправки сообщения: ${e}`)
            })
        }

        console.log(e)
    }

})

// Обработка кнопок
bot.on('callback_query', async msg => {

    const data = msg.data
    const chatIdUsr = msg.message.chat.id
    const candidate = await getUserById(chatIdUsr)


    if(data === 'Офис Москва') {
        await bot.sendMessage(chatIdUsr, addressMsg)
        candidate.office = data
        await candidate.save()

        return
    }

    if(data === 'Удаленное') {
        await bot.sendMessage(chatIdUsr, whichMsg, techOptions)
        candidate.office = data
        await candidate.save()

        return
    }

    if(['Нужен монитор и ноутбук', 'Нужен монитор', 'Нужен ноутбук', 'Не нужна'].includes(data)) {
        await bot.sendMessage(chatIdUsr, whichWorkBookMsg, workBookOptions)
        candidate.needTech = data
        await candidate.save()

        return
    }

    if(['Электронная трудовая', 'Бумажная трудовая'].includes(data)) {
        candidate.workBook = data
        await candidate.save()

        return data === 'Электронная трудовая'
            ? await bot.sendMessage(chatIdUsr, ifCardMsg, salaryBookMoreOptions)
            : await bot.sendMessage(chatIdUsr, formWorkBookMsg, workBookMoreOptions)
    }

    if(['Продолжить в электронной', 'Продолжить в бумажной'].includes(data)) {
        if ('Продолжить в электронной' === data) {
            await bot.sendMessage(chatIdUsr, declarationWorkBookUrl, {parse_mode: "HTML"})
        }
        candidate.needWorkBook = data

        await candidate.save()
        await bot.sendMessage(chatIdUsr, ifCashCardMsg, salaryBookMoreOptions)

        return
    }

    if(['Есть Альфа счет', 'Нет Альфа счет'].includes(data)) {

        if ('Нет Альфа счет' === data) {
            await bot.sendMessage(chatIdUsr, declarationBillUrl,{parse_mode: "HTML"})
        }

        if ('Есть Альфа счет' === data) {
            await bot.sendMessage(chatIdUsr, sendBillMsg)
        }
        candidate.order = data
        await candidate.save()

        await bot.sendMessage(chatIdUsr, formPackageMsg)

        await bot.sendMessage(chatIdUsr, declarationPersonalDataUrl,{parse_mode: "HTML"})

        const usersAdmin = await getAdmins()

        usersAdmin.every(async user => {
            return await bot.sendMessage(user.chatId, applicationMsg(candidate))
        })
    }
})

async function getAdmins() {
    return await UserModel.findAll({
        where: {
            admin: true
        }
    })
}

async function getUserById(id) {
    return  id && await UserModel.findOne({ where: { chatId: id }})
}

async function isUserAdmin(msg) {

    const user = await UserModel.findOne({ where: { chatId: msg.chat.id }})

    return  user && user.admin
}

async function userCreate(msg) {
    await UserModel.create(
        {
            chatId: msg.chat.id,
            userName: msg.from.username,
            firstName: msg.from.first_name,
            lastName: msg.from.last_name
        })
}