import requestTraceFactory from './requestTrace';
import createTraceFactory from './createTrace';
import updateTraceFactory from './updateTrace';
import verifySignatureFactory from './verifyTrace';

export default (database, keyContext, hash) => {
  const createTrace = createTraceFactory(hash, keyContext);
  const updateTrace = updateTraceFactory(hash, keyContext);
  const verifySignature = verifySignatureFactory(hash);

  return requestTraceFactory(database, keyContext, hash, createTrace, updateTrace, verifySignature);
};
