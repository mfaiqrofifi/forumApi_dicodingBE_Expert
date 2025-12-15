const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadDetailsUseCase = require('../../../../Applications/use_case/GetThreadDetailsUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);

    const owner = request.auth.credentials.id;

    const addedThread = await addThreadUseCase.execute({
      title: request.payload.title,
      body: request.payload.body,
      owner,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });

    response.code(201);
    return response;
  }

  async getThreadDetailHandler(request, h) {
    const getThreadDetailsUseCase = this._container.getInstance(
      GetThreadDetailsUseCase.name
    );
    const { threadId } = request.params;

    const thread = await getThreadDetailsUseCase.execute(threadId);

    return h.response({
      status: 'success',
      data: {
        thread,
      },
    });
  }
}

module.exports = ThreadsHandler;
