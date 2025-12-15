const NewReply = require('../NewReply');

describe('NewReply', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: '',
    };

    expect(() => new NewReply(payload)).toThrowError(
      'NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      content: 123,
    };

    expect(() => new NewReply(payload)).toThrowError(
      'NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create NewReply object correctly', () => {
    const payload = {
      content: 'sebuah balasan',
    };

    const newReply = new NewReply(payload);

    expect(newReply.content).toEqual(payload.content);
  });
});
