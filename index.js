const TelegramApi = require('node-telegram-bot-api')
const fs = require('fs').promises;
const {decorOptions, techOptions, workBookOptions, workBookMoreOptions, salaryBookMoreOptions} = require('./buttonOption')
require('dotenv').config()

const bot = new TelegramApi(process.env.TOKEN_BOT, { polling: true })

const workerData = {}

let dataCandidates = {}

// Установка команд
bot.setMyCommands( [
    { command: '/start', description: 'Начальное приветствие' },
    { command: '/info', description: 'Информация о компании' }
])

// Обработка сообщений
bot.on( 'message',  async msg => {
    const text = msg.text
    const chatId = msg.chat.id
    const userName = msg.from.username


    await readCandidateDate()

    if (dataCandidates[userName]) {
        return await bot.sendMessage(chatId, 'Извините, но Ваша анкета уже была отправлена HR менеджеру :)')
    }

    if (text === '/start') {
        await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/897/df3/897df311-e19d-4a7d-8b27-4929abbcf2cc/1.webp')
        await bot.sendMessage(chatId, 'Добро пожаловать в ассистент бот, который поможет Вам с оформлением в нашей компании:)' +
            'Выберите, пожалуйста, предпочтительный способ оформления)', decorOptions)

        return
    }

    if (text === '/info') {
        return await bot.sendMessage(chatId, `${msg.from.first_name} ${msg.from.last_name} компания Ай-Ди Технологии управления занимается разработкой и внедрением собственного программного обеспечения`)
    }

    return await bot.sendMessage(chatId, 'Извините, но я пока не умею отвечать на незнакомые сообщения :(')

})

// Обработка кнопок
bot.on('callback_query', async msg => {
    const data = msg.data
    const chatId = msg.message.chat.id

    if(data === 'Офис Москва') {
        await bot.sendMessage(chatId, 'Ждем вас с нетерпением в нашем офисе по адресу' +
            '' +
            'г. Москва, ул. Дербеневская набережная д.11А')
        workerData.office = data

        return
    }

    if(data === 'Удаленное') {
        await bot.sendMessage(chatId, 'Какая техника Вам потребуется для работы?', techOptions)
        workerData.office = data

        return
    }

    if(['Нужен монитор и ноутбук', 'Нужен монитор', 'Нужен ноутбук', 'Не нужна'].includes(data)) {
        await bot.sendMessage(chatId, 'Какая у вас трудовая книжка?', workBookOptions)
        workerData.needTech = data

        return
    }

    if(['Электронная трудовая', 'Бумажная трудовая'].includes(data)) {
        await bot.sendMessage(chatId, 'В каком виде хотите продолжить вести трудовую книжку?', workBookMoreOptions)
        workerData.workBook = data

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
            workerData.needWorkBook = data
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
        workerData.order = data

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


        await bot.sendMessage(process.env.ADMIN_ID, `Заявка от ${msg.from.first_name} ${msg.from.last_name}: \@${msg.from.username}
        ✅ Место оформления: ${workerData.office}
        ✅ Техника: ${workerData.needTech}
        ✅ Тип трудовой сейчас: ${workerData.workBook}
        ✅ Тип трудовой нужен: ${workerData.needWorkBook}
        ✅ Счет в Альфа Банк:  ${workerData.order}
        `)
    }

    await saveCandidateDate(msg)
})

async function saveCandidateDate(msg) {
    dataCandidates[msg.from.username] = workerData
    const nextCandidate = JSON.stringify(dataCandidates)
    await fs.writeFile('./candidates.json', nextCandidate, err => {
        if (err) {
            console.log(err.message);
        }
    })
}

async function readCandidateDate() {
    try {
        const data = await fs.readFile('./candidates.json');
        dataCandidates = JSON.parse(data)

    } catch (e) {}
}