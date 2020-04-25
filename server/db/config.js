import mongodbErrorHandler from 'mongoose-mongodb-errors';
import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}).then(
  () => true,
  () => {
    process.exit(1);
  },
);

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    process.exit(0);
  });
});
mongoose.plugin(mongodbErrorHandler);
module.exports = {
  mongoose,
};
