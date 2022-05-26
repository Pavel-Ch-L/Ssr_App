const private = require('../keys')

module.exports = function (email, name, token) {
  return {
    'subject':'Восстановление доступа',
    'sender' : private.mailSender,
    //'replyTo' : {'email':'api@sendinblue.com', 'name':'Sendinblue'},
    'to' : [{'name': `${name}`, 'email': `${email}`}],
    'htmlContent' : `
      <html>
        <body>
          <h1>Вы забыли пароль ?</h1>
          <p>Если нет, то проигнорируйте данное письмо</p>
          <p>Иначе нажмите на ссылку ниже:</p>
          <p><a href ="${private.baseURL}/auth/password/${token}"></a></p>
          <hr/>
          <a href="${private.baseURL}">Магазин курсов</a>
        </body>
      </html>
    `
  }
}