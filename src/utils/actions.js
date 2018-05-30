export const createAsyncAction = (actionType) => ({
  PENDING: `${actionType}_PENDING`,
  SUCCESS: `${actionType}_SUCCESS`,
  FAILURE: `${actionType}_FAILURE`,
  type: actionType
});
