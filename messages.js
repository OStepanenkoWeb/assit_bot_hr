module.exports = {
    welcomeMsg: 'Добро пожаловать в ассистент бот, который поможет Вам с оформлением в нашей компании:)' +
    'Выберите, пожалуйста, предпочтительный способ оформления)',
    infoMsg: (user) => `${user.first_name} ${user.last_name} компания Ай-Ди Технологии управления занимается разработкой и внедрением собственного программного обеспечения`,
    sorryMsg: 'Извините, но я пока не умею отвечать на незнакомые сообщения :(',
    addressMsg: 'Ждем вас с нетерпением в нашем офисе по адресу г. Москва, ул. Дербеневская набережная д.11А',
    whichMsg: 'Какая техника Вам потребуется для работы?',
    whichWorkBookMsg: 'Какая у вас трудовая книжка?',
    ifCardMsg: 'Зарплатный проект Альфа банк. Если ли у вас карта?',
    formWorkBookMsg: 'В каком виде хотите продолжить вести трудовую книжку?',
    declarationWorkBookUrl: "<strong>Скачайте пожалуйста бланк заявления на переход ведения в электронную трудовую книжку, заполните и отправьте HR </strong>" +
        "<a href='https://docs.google.com/document/d/1m_wPVDWLvDewPPl1iCVTiuzmwW-bBJ-L/edit?usp=sharing&ouid=109174770860598202689&rtpof=true&sd=true'>Заявление на электронную трудовую</a>",
    ifCashCardMsg: 'Зарплатный проект Альфа банк. Если ли у вас карта?',
    declarationBillUrl: 'Скачайте пожалуйста бланк заявления на открытие счета в Альфа Банк,' +
        'заполните и отправьте HR ' +
        "<a href='https://docs.google.com/document/d/1BMoBNpEHWkt56KkY437U5QSCCi6XN2Nu/edit?usp=sharing&ouid=109174770860598202689&rtpof=true&sd=true'>Заявление на открытие счета</a>",
    sendBillMsg: 'Отправьте пожалуйста реквизиты своего счета HR',
    formPackageMsg: 'Для дальнейшего оформления необходимо прислать HR менеджеру следующий пакет документов:' +
        'Фото/сканы:\n' +
        '1.  паспорт;\n' +
        '2.  страховое свидетельство ПФР (зелёная карточка СНИЛС);\n' +
        '3.  ИНН;\n' +
        '4.  диплом об образовании (первая страница, где есть номер диплома);\n' +
        '5.  военный билет или приписное.\n' +
        '6.  свидетельство о рождение ребенка (детей);\n' +
        '7.  реквизиты карты ( или заявление) \n' +
        '8. Адрес куда доставить документы.\n' +
        '9. Заявление на обработку персональных данных.\n' +
        '\n' +
        'Если вы выбрали удаленный формат оформления оригиналы заявлений с «живой» подписью нужно будет в дальнейшем отдать курьеру. ' +
        'Вместе с оригиналами заявлений ему будет необходимо отдать оригинал трудовой книжки ( если бумажная).',
    declarationPersonalDataUrl: "<a href='https://drive.google.com/file/d/1tlYCRJFbzcxSF1Ije3_goFhDkkyN35PA/view?usp=sharing'>Заявление на обработку персональных данных</>",
    applicationMsg : (candidate) => `Заявка от ${candidate.firstName || ''} ${candidate.lastName || ''}: \@${candidate.userName}
        ✅ Место оформления: Удаленное
        ✅ Техника: ${candidate.needTech || 'нет ответа'}
        ✅ Тип трудовой сейчас: ${candidate.workBook || 'нет ответа'}
        ✅ Тип трудовой нужен: ${candidate.needWorkBook || 'нет ответа'}
        ✅ Счет в Альфа Банк:  ${candidate.order || 'нет ответа'}
        `



}