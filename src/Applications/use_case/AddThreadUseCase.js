const NewThread = require('../../Domains/threads/entities/NewThread');
const AddedThread = require('../../Domains/threads/entities/AddedThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const newThread = new NewThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
    });

    const addedThread = await this._threadRepository.addThread(
      newThread,
      useCasePayload.owner
    );
    return new AddedThread(addedThread);
  }
}

module.exports = AddThreadUseCase;
