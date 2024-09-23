import Webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import config from '../../webpack.dev.js'; // Замените на правильный путь

const PORT = 9000;

const compiler = Webpack(config);
const devServerOptions = { ...config.devServer, open: false, port: PORT };
const server = new WebpackDevServer(devServerOptions, compiler);

const runServer = async () => {
  console.log('Starting server on port ' + PORT);
  try {
    await server.start();
    console.log('Server started on port ' + PORT); // Log that server has started
    if (process.send) {
      console.log('Sending "ok" message to parent process');
      process.send('ok');
    }
  } catch (error) {
    console.error('Error starting server:', error); // Log any errors
    if (process.send) {
      console.log('Sending "error" message to parent process');
      process.send('error');
    }
  }
};

runServer();
