const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('../../webpack.dev');
const PORT = 9000;

const compiler = Webpack(config);
const devServerOptions = { ...config.devServer, open: false, port: PORT };
const server = new WebpackDevServer(devServerOptions, compiler);

const runServer = async () => {
  console.log('Starting server on port ' + PORT);
  try {
    await server.start();
    console.log('Server started on port ' + PORT); // Log that server has started
    process.send('ok');
  } catch (error) {
    console.error('Error starting server:', error); // Log any errors
    process.send('error');
  }
};

runServer();
