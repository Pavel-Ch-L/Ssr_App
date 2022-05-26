const private = require('../keys')
const SibApiV3Sdk = require('sib-api-v3-sdk')
const regEmail = require('./registration')

module.exports = function (email, name) {
  SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = private.sendBlueAPI;
  new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail(
    regEmail(email, name)
  ).then(function(data) {
    console.log(data);
  }, function(error) {
    console.error(error);
  }); 
}

