const TelegramApi = require('node-telegram-bot-api')
require('dotenv').config()

const bot = new TelegramApi(process.env.TOKEN_BOT, { polling: true })

const decorOptions = {
    reply_markup: JSON.stringify( {
        inline_keyboard: [
            [ {text: 'Удаленное 👨‍💻', callback_data: 'Удаленное'}],
            [ {text: 'Офис Москва 🏢', callback_data: 'Офис Москва'}]
        ]
    })
}

const techOptions = {
    reply_markup: JSON.stringify( {
        inline_keyboard: [
            [ {text: 'Нужен монитор 🖥', callback_data: 'Нужен монитор'}, {text: 'Нужен ноутбук 💻', callback_data: 'Нужен ноутбук'}],
            [ {text: 'Нужен монитор и ноутбук 🖥 💻', callback_data: 'Нужен монитор и ноутбук'}],
            [ {text: 'Не нужна 🙅', callback_data: 'Не нужна'}]
        ]
    })
}

const workBookOptions = {
    reply_markup: JSON.stringify( {
        inline_keyboard: [
            [ {text: 'Электронная трудовая книжка 🪪', callback_data: 'Электронная трудовая'}],
            [ {text: 'Бумажная трудовая книжка 📖', callback_data: 'Бумажная трудовая'}]
        ]
    })
}

const workBookMoreOptions = {
    reply_markup: JSON.stringify( {
        inline_keyboard: [
            [ {text: 'Продолжить в электронной трудовой книжке 🪪', callback_data: 'Продолжить в электронной'}],
            [ {text: 'Продолжить в бумажной трудовой книжке 📖', callback_data: 'Продолжить в бумажной'}]
        ]
    })
}

const salaryBookMoreOptions = {
    reply_markup: JSON.stringify( {
        inline_keyboard: [
            [ {text: 'Есть ✅', callback_data: 'Есть Альфа счет'}],
            [ {text: 'Нет ❌', callback_data: 'Нет Альфа счет'}]
        ]
    })
}

bot.setMyCommands( [
    { command: '/start', description: 'Начальное приветствие' },
    { command: '/info', description: 'Информация о компании' }
])

bot.on( 'message',  async msg => {
    const text = msg.text
    const chatId = msg.chat.id

    if (text === '/start') {
        await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/897/df3/897df311-e19d-4a7d-8b27-4929abbcf2cc/1.webp')
        await bot.sendMessage(chatId, 'Добро пожаловать в ассистент бот, который поможет Вам с оформлением в нашей компании:)' +
            'Выберите, пожалуйста, предпочтительный способ оформления)', decorOptions)
    }

    if (text === '/info') {
        await bot.sendMessage(chatId, `${msg.from.first_name} ${msg.from.last_name} компания Ай-Ди Технологии управления занимается разработкой и внедрением собственного программного обеспечения`)
    }
})

bot.on('callback_query', async msg => {
    const data = msg.data
    const chatId = msg.message.chat.id
console.log(data)
    if(data === 'Офис Москва') {
        await bot.sendMessage(chatId, 'Ждем вас с нетерпением в нашем офисе по адресу' +
            '' +
            'г. Москва, ул. Дербеневская набережная д.11А')
    }

    if(data === 'Удаленное') {
        await bot.sendMessage(chatId, 'Какая техника Вам потребуется для работы?', techOptions)
    }

    if(['Нужен монитор и ноутбук', 'Нужен монитор', 'Нужен ноутбук', 'Не нужна'].includes(data)) {
        await bot.sendMessage(chatId, 'Какая у вас трудовая книжка?', workBookOptions)
    }

    if(['Электронная трудовая', 'Бумажная трудовая'].includes(data)) {
        await bot.sendMessage(chatId, 'В каком виде хотите продолжить вести трудовую книжку?', workBookMoreOptions)
    }

    if(['Продолжить в электронной', 'Продолжить в бумажной'].includes(data)) {
        if ('Продолжить в бумажной трудовой книжке' === data) {
            await bot.sendMessage(chatId, 'Скачайте пожалуйста бланк заявления на переход ведения в электронную трудовую книжку,' +
                'заполните и отправьте HR')
        }
        await bot.sendMessage(chatId, 'Зарплатный проект Альфа банк. Если ли у вас карта?', salaryBookMoreOptions)
    }

    if(['Есть Альфа счет', 'Нет Альфа счет'].includes(data)) {
        if ('Нет Альфа счет' === data) {
            await bot.sendMessage(chatId, 'Скачайте пожалуйста бланк заявления на открытие счета в Альфа Банк,' +
                'заполните и отправьте HR')
        }
        if ('Есть Альфа счет' === data) {
            await bot.sendMessage(chatId, 'Отправьте пожалуйста реквизиты своего счета HR')
        }

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
    }

})