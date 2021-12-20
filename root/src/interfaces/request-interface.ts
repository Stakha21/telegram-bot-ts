export interface Callback {
  callback_query: {
    message: {
      message_id: number;
      chat: {
        id: string;
      };
    };
    from: {
      username: string;
    };
    data: string;
  };
}

export interface Request {
  message: {
    text: string;
    chat: {
      id: string;
    };
    from: {
      username: string;
      first_name: string;
    };
  };
}
