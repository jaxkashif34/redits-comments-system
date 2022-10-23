import { useCallback, useEffect, useState } from 'react';

export const useAsync = (func, dependancies = []) => {
  const { execute, ...state } = useAsyncInternal(func, dependancies, true);

  useEffect(() => {
    execute();
  }, [execute]); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
};
export const useAsyncFn = (func, dependancies = []) => {
  return useAsyncInternal(func, dependancies, false);
};

const useAsyncInternal = (func, dependancies, initialLoading = false) => {
  const [loading, setLoading] = useState(initialLoading);
  const [errors, setErrors] = useState(null);
  const [value, setValue] = useState(null);

  const execute = useCallback((...params) => {
    setLoading(true);
    return func(...params)
      .then((data) => {
        setValue(data);
        setErrors(undefined);
        return data;
      })
      .catch((err) => {
        setValue(undefined);
        setErrors(err);
        return Promise.reject(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, dependancies); // eslint-disable-line react-hooks/exhaustive-deps
  return { errors, loading, value, execute };
};
