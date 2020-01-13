const OrderModel = require ('./model/Order')
const AWS = require("aws-sdk");
let util = require('./utils');

module.exports.createOrder = (event, context, callback) => {
 
  const data = JSON.parse(event.body);
  console.log(data)
  const order = new OrderModel({
   ...data
  });

  let email = "vitalizinkevich@gmail.com"
  let ragu = "otdelkavdome@mail.ru"
  const textBody = `
    текст тела письма
  `;
  const paramsAdmin = {
    Destination: {
      ToAddresses: [email, ragu]
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `Имя ${data.name}, телефон ${data.phone}, работы  ${data.workType.toString()}`
        },
        Text: {
          Charset: "UTF-8",
          Data: textBody
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: "сообщение сайта по стройке"
      }
    },
    Source: "vitalizinkevich@gmail.com"
  };

  let emailPromise = new AWS.SES({ apiVersion: "2010-12-01" })
    .sendEmail(paramsAdmin)
    .promise ()

  emailPromise.then ((res)=>{
    util.dbConnectAndExecute(util.mongoString, () => (
      order
        .save()
        .then(() => callback(null, {
            statusCode: 200,
          body: JSON.stringify({ id: order.id }),
          headers: {  
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true }
        }))      
        .catch(err => callback(null, util.createErrorResponse(err.statusCode, err.message)))
    ));
  }).catch ((err)=>{callback(null, util.createErrorResponse(err.statusCode, err.message))})
  
};