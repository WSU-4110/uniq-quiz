const mockAxios = {
    defaults: {
        withCredentials: false,
        headers: {
          common: {}
        },
        baseURL: ''
      },
    create: jest.fn(() => mockAxios),
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };
  
export default mockAxios;