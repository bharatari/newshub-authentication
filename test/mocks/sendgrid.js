class Email {
  constructor(to) {
    this.to = to;
  }
}

class Content {
  constructor(type, body) {
    this.type = type;
    this.body = body;
  }
}

class Mail {
  constructor() {

  }
  setSubject(subject) {

  }
  addContent(content) {

  }
  setFrom(fromEmail) {

  }
  setTemplateId(template) {

  }
  addPersonalization(personalization) {

  }
  toJSON() {

  }
}

class Personalization {
  constructor() {

  }
  addTo(toEmail) {

  }
}

module.exports = {
  SendGrid(key) {
    return {
      emptyRequest() {
        return {};
      },
      API(request, cb) {
        cb({
          statusCode: 200,
        });
      },
    };
  },
  mail: {
    Email,
    Content,
    Mail,
    Personalization,
  }
};
