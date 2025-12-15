const DetailComment = require('../DetailComment');

describe('DetailComment entity', () => {
  it('should throw error when payload missing needed property', () => {
    expect(() => new DetailComment({})).toThrow(
      'DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type spec', () => {
    const payload = {
      id: 1,
      username: 2,
      date: 3,
      content: 4,
      is_delete: 'no',
      replies: {},
    };
    expect(() => new DetailComment(payload)).toThrow(
      'DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should map content and replies correctly when not deleted', () => {
    const payload = {
      id: 'comment-1',
      username: 'jane',
      date: '2021-08-08T07:19:09.775Z',
      content: 'comment',
      is_delete: false,
      replies: [
        {
          id: 'reply-1',
          username: 'john',
          date: '2021-08-08T07:19:09.775Z',
          content: 'hello',
          is_delete: false,
        },
      ],
    };
    const entity = new DetailComment(payload);
    expect(entity).toMatchObject({
      id: 'comment-1',
      username: 'jane',
      content: 'comment',
    });
    expect(Array.isArray(entity.replies)).toBe(true);
    expect(entity.replies[0].content).toBe('hello');
  });

  it('should map deleted comment content and deleted reply content', () => {
    const payload = {
      id: 'comment-1',
      username: 'jane',
      date: '2021-08-08T07:19:09.775Z',
      content: 'comment',
      is_delete: true,
      replies: [
        {
          id: 'reply-1',
          username: 'john',
          date: '2021-08-08T07:19:09.775Z',
          content: 'hello',
          is_delete: true,
        },
      ],
    };
    const entity = new DetailComment(payload);
    expect(entity.content).toBe('**komentar telah dihapus**');
    expect(entity.replies[0].content).toBe('**balasan telah dihapus**');
  });
});
