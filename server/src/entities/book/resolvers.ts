import { books } from './data';

const bookResolvers = {
  Query: {
    books: () => books,
  },
};

export default bookResolvers;
