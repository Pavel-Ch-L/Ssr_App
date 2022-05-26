const private = require('../keys')

module.exports = function (mail) {
  return {
    'subject':'Магазин курсов',
    'sender' : private.mailSender,
    'replyTo' : {'email':'api@sendinblue.com', 'name':'Sendinblue'},
    'to' : [{'name': 'Pavel Ch', 'email': `${mail}`}],
    'htmlContent' : `
      <html><body>
        <h1>Добро пожаловать на наш сайт</h1>
        <p>Вы успешно создали аккаунт с email - ${mail}</p>
        <hr/>
        <a href="${private.baseURL}">Магазин курсов</a>
      </body></html>
    `
  }
}