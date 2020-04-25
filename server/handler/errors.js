
const codeGenerate = (name, message) => ({
  error: {
    name,
    message,
  },
});
const notFound = (req, res) => res.status(404).send(codeGenerate('noEnpointFound', 'Endpoint not found'));
const catchErrors = (fn) => (req, res, next) => fn(req, res, next).catch(async (error) => {
  const { code } = error;
  console.log(error)
  if (!code) return res.status(500).send(codeGenerate('internalError', error.message || error));
  return res.status(400).send(codeGenerate(error.code, error.message || ''));
});
function Exception(message, code = 400) {
  this.message = message;
  this.name = 'Exception';
  this.code = code;
  if (this.code === 11000) this.code = 406;
}
export {
  notFound,
  codeGenerate,
  catchErrors,
  Exception,
};
