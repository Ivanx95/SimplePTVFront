module.exports = function Message(
  uuid,
  destiny,
  typeDestiny,
  channel,
  origin,
  typeOrigin,
  content,
  codeResponse
) {
  this.uuid = uuid;
  this.destiny = destiny;
  this.typeDestiny = typeDestiny;
  this.channel = channel;
  this.origin = origin;
  this.typeOrigin = typeOrigin;
  this.content = content;
  this.codeResponse = codeResponse;
};
