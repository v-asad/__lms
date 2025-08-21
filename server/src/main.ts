import config from './config/config';
import app from './app';

app.listen(config.port, "0.0.0.0", () => {
  console.log(`Server running on port ${config.port}`);
});
