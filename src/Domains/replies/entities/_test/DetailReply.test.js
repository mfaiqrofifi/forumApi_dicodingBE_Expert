const DetailReply = require('../DetailReply');

describe('DetailReply entity', () => {
  it('should throw error when payload missing needed property', () => {
    expect(() => new DetailReply({})).toThrow(
      'DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type spec', () => {
    const payload = {
      id: 123,
      username: 456,
      date: 789,
      content: 10,
      is_delete: 'no',
    };
    expect(() => new DetailReply(payload)).toThrow(
      'DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should map content normally when not deleted', () => {
    const payload = {
      id: 'reply-1',
      username: 'john',
      date: '2021-08-08T07:19:09.775Z',
      content: 'hello',
      is_delete: false,
    };
    const entity = new DetailReply(payload);
    expect(entity).toMatchObject({
      id: 'reply-1',
      username: 'john',
      content: 'hello',
    });
  });

  it('should map content to deleted message when is_delete true', () => {
    const payload = {
      id: 'reply-1',
      username: 'john',
      date: '2021-08-08T07:19:09.775Z',
      content: 'hello',
      is_delete: true,
    };
    const entity = new DetailReply(payload);
    expect(entity.content).toBe('**balasan telah dihapus**');
  });
});
