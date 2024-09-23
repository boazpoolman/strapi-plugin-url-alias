import register from './register';
import bootstrap from './bootstrap';
import searchRoutes from './routes/search';
import searchControllers from './controllers/search';

export default {
  register,
  bootstrap,
  routes: {
    'content-api': {
      type: 'content-api',
      routes: [
        ...searchRoutes,
      ],
    },
  },
  controllers: {
    search: searchControllers,
  },
};
