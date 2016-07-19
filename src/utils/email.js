const sendgrid = require('sendgrid')
const helper = require('sendgrid').mail

module.exports = {
  templates: {
    'UTD_TV_SIGNUP': '7f610a12-21fe-4b50-a4ae-c8f974598d3c',
    'ADMIN_ACTION': '2c6c78f3-784c-4663-9709-766963c5617d',
    'USER_RESERVATION_RESPONSE': '58154394-8687-4655-b92a-07bb34796276',
    'CREATED_RESERVATION': '9cb91814-4954-4be8-83c6-d5ac609063c3',
  },
  sendEmail(app, to, subject, body, template) {
    return new Promise((resolve, reject) => {
      const client = sendgrid.SendGrid(app.get('keys').SENDGRID_KEY);

      const from_email = new helper.Email("technology@utdtv.com");
      const to_email = new helper.Email(to);
      const content = new helper.Content("text/html", body);
      const mail = new helper.Mail();
      
      mail.setSubject(subject);
      mail.addContent(content);
      mail.setFrom(from_email);
      mail.setTemplateId(this.templates[template]);

      const personalization = new helper.Personalization();
      personalization.addTo(to_email);
      mail.addPersonalization(personalization);

      const requestBody = mail.toJSON();
      const request = client.emptyRequest();

      request.method = 'POST';
      request.path = '/v3/mail/send';
      request.body = requestBody;

      client.API(request, function (response) {
        if (response.statusCode >= 300) {
          reject(response);
        } else {
          resolve(response);
        }
      });
    });    
  },
};
