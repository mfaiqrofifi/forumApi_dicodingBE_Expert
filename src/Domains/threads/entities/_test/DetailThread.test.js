const DetailThread = require('../DetailThread');

describe('DetailThread entity', () => {
  it('should throw error when payload missing needed property', () => {
    expect(() => new DetailThread({})).toThrow(
      'DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload not meet data type spec', () => {
    const payload = {
      id: 1,
      title: 2,
      body: 3,
      date: 4,
      username: 5,
      comments: {},
    };
    expect(() => new DetailThread(payload)).toThrow(
      'DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should map comments into DetailComment', () => {
    const payload = {
      id: 'thread-1',
      title: 'title',
      body: 'body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'owner',
      comments: [
        {
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
          likeCount: 2,
        },
      ],
    };
    const entity = new DetailThread(payload);
    expect(entity).toMatchObject({
      id: 'thread-1',
      title: 'title',
      username: 'owner',
    });
    expect(Array.isArray(entity.comments)).toBe(true);
    expect(entity.comments[0].replies[0].content).toBe('hello');
    expect(entity.comments[0].likeCount).toBe(2);
  });
});
