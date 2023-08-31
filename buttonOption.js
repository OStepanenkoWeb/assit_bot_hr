module.exports = {
    decorOptions: {
        reply_markup: JSON.stringify( {
            inline_keyboard: [
                [ {text: 'Удаленное 👨‍💻', callback_data: 'Удаленное'}],
                [ {text: 'Офис Москва 🏢', callback_data: 'Офис Москва'}]
            ]
        })
    },
    techOptions: {
        reply_markup: JSON.stringify( {
            inline_keyboard: [
                [ {text: 'Нужен монитор 🖥', callback_data: 'Нужен монитор'}, {text: 'Нужен ноутбук 💻', callback_data: 'Нужен ноутбук'}],
                [ {text: 'Нужен монитор и ноутбук 🖥 💻', callback_data: 'Нужен монитор и ноутбук'}],
                [ {text: 'Не нужна 🙅', callback_data: 'Не нужна'}]
            ]
        })
    },
    workBookOptions: {
        reply_markup: JSON.stringify( {
            inline_keyboard: [
                [ {text: 'Электронная трудовая книжка 🪪', callback_data: 'Электронная трудовая'}],
                [ {text: 'Бумажная трудовая книжка 📖', callback_data: 'Бумажная трудовая'}]
            ]
        })
    },
    workBookMoreOptions: {
        reply_markup: JSON.stringify( {
            inline_keyboard: [
                [ {text: 'Продолжить в электронной трудовой книжке 🪪', callback_data: 'Продолжить в электронной'}],
                [ {text: 'Продолжить в бумажной трудовой книжке 📖', callback_data: 'Продолжить в бумажной'}]
            ]
        })
    },
    salaryBookMoreOptions: {
        reply_markup: JSON.stringify( {
            inline_keyboard: [
                [ {text: 'Есть ✅', callback_data: 'Есть Альфа счет'}],
                [ {text: 'Нет ❌', callback_data: 'Нет Альфа счет'}]
            ]
        })
    }
}