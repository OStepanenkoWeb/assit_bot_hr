const TelegramApi = require('node-telegram-bot-api')
const {decorOptions, techOptions, workBookOptions, workBookMoreOptions, salaryBookMoreOptions} = require('./buttonOption')
const sequelize = require('./db')
const UserModel = require('./models')
require('dotenv').config()

const bot = new TelegramApi(process.env.TOKEN_BOT, { polling: true })

const testConnectDB = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        console.log('Connection has been established successfully.')
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
}

testConnectDB()


// Установка команд
bot.setMyCommands( [
    { command: '/start', description: 'Начальное приветствие' },
    { command: '/info', description: 'Информация о компании' }
])

// Обработка сообщений
bot.on( 'message',  async msg => {
    const text = msg.text
    const chatId = msg.chat.id


    try {
        const user = await UserModel.findOne({chatId})
        const isAdmin = user.admin

        if (user && user.order && !isAdmin) {
            return await bot.sendMessage(chatId, 'Извините, но Ваша анкета уже была отправлена HR менеджеру :)')
        }


        if (text === '/start') {
            if(!isAdmin) {
                await UserModel.create({chatId})
            }

            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/897/df3/897df311-e19d-4a7d-8b27-4929abbcf2cc/1.webp')
            await bot.sendMessage(chatId, 'Добро пожаловать в ассистент бот, который поможет Вам с оформлением в нашей компании:)' +
                'Выберите, пожалуйста, предпочтительный способ оформления)', decorOptions)
            return

        }


        if (text === '/info') {
            return await bot.sendMessage(chatId, `${msg.from.first_name} ${msg.from.last_name} компания Ай-Ди Технологии управления занимается разработкой и внедрением собственного программного обеспечения`)
        }
    } catch (e) {
        const users = await getAdmins()

        if (Array.isArray(users) && users.length) {
            users.every(async user => {
                    await bot.sendMessage(user.chatId, `Произошла ошибка отправки сообщения: ${e}`)
            })
        }
    }

    return await bot.sendMessage(chatId, 'Извините, но я пока не умею отвечать на незнакомые сообщения :(')

})

// Обработка кнопок
bot.on('callback_query', async msg => {
    const data = msg.data
    const chatId = msg.message.chat.id
    const candidate = await UserModel.findOne({ chatId })

    candidate.userName = msg.from.username
    candidate.firstName = msg.from.first_name
    candidate.lastName = msg.from.last_name
    await candidate.save()

    if(data === 'Офис Москва') {
        await bot.sendMessage(chatId, 'Ждем вас с нетерпением в нашем офисе по адресу' +
            '' +
            'г. Москва, ул. Дербеневская набережная д.11А')
        candidate.office = data
        candidate.save()

        return
    }

    if(data === 'Удаленное') {
        await bot.sendMessage(chatId, 'Какая техника Вам потребуется для работы?', techOptions)
        candidate.office = data
        candidate.save()

        return
    }

    if(['Нужен монитор и ноутбук', 'Нужен монитор', 'Нужен ноутбук', 'Не нужна'].includes(data)) {
        await bot.sendMessage(chatId, 'Какая у вас трудовая книжка?', workBookOptions)
        candidate.needTech = data
        candidate.save()

        return
    }

    if(['Электронная трудовая', 'Бумажная трудовая'].includes(data)) {
        await bot.sendMessage(chatId, 'В каком виде хотите продолжить вести трудовую книжку?', workBookMoreOptions)
        candidate.workBook = data
        candidate.save()

        return
    }

    if(['Продолжить в электронной', 'Продолжить в бумажной'].includes(data)) {
        if ('Продолжить в электронной' === data) {
            await bot.sendMessage(
                chatId,
                "<strong>Скачайте пожалуйста бланк заявления на переход ведения в электронную трудовую книжку, заполните и отправьте HR </strong>" +
                "<a href='https://docs.google.com/document/d/1m_wPVDWLvDewPPl1iCVTiuzmwW-bBJ-L/edit?usp=sharing&ouid=109174770860598202689&rtpof=true&sd=true'>Заявление на электронную трудовую</a>",
                {parse_mode: "HTML"}
            )
        }
            candidate.needWorkBook = data
            candidate.save()

        await bot.sendMessage(chatId, 'Зарплатный проект Альфа банк. Если ли у вас карта?', salaryBookMoreOptions)

        return
    }

    if(['Есть Альфа счет', 'Нет Альфа счет'].includes(data)) {

        if ('Нет Альфа счет' === data) {
            await bot.sendMessage(chatId, 'Скачайте пожалуйста бланк заявления на открытие счета в Альфа Банк,' +
                'заполните и отправьте HR ' +
                "<a href='https://docs.google.com/document/d/1BMoBNpEHWkt56KkY437U5QSCCi6XN2Nu/edit?usp=sharing&ouid=109174770860598202689&rtpof=true&sd=true'>Заявление на открытие счета</a>",{parse_mode: "HTML"})
        }

        if ('Есть Альфа счет' === data) {
            await bot.sendMessage(chatId, 'Отправьте пожалуйста реквизиты своего счета HR')
        }
        candidate.order = data
        candidate.save()

        await bot.sendMessage(chatId, 'Для дальнейшего оформления необходимо прислать HR менеджеру следующий пакет документов:' +
            'Фото/сканы:\n' +
            '1.  паспорт;\n' +
            '2.  страховое свидетельство ПФР (зелёная карточка СНИЛС);\n' +
            '3.  ИНН;\n' +
            '4.  диплом об образовании (первая страница, где есть номер диплома);\n' +
            '5.  военный билет или приписное.\n' +
            '6.  свидетельство о рождение ребенка (детей);\n' +
            '7.  реквизиты карты ( или заявление) \n' +
            '\n' +
            'Оригиналы заявлений с «живой» подписью нужно будет в дальнейшем отдать курьеру. ' +
            'Вместе с оригиналами заявлений ему будет необходимо отдать оригинал трудовой книжки ( если бумажная)')

        const users = await getAdmins()

        users.every(async user => {
            await bot.sendMessage(user.chatId, `Заявка от ${user.firstName} ${user.lastName}: \@${user.userName}
        ✅ Место оформления: ${candidate.office}
        ✅ Техника: ${candidate.needTech}
        ✅ Тип трудовой сейчас: ${candidate.workBook}
        ✅ Тип трудовой нужен: ${candidate.needWorkBook}
        ✅ Счет в Альфа Банк:  ${candidate.order}
        `)
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