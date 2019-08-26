import rp from "request-promise";

export const MakeRequest = async (url, data) => {
  const options = {
    withCredentials: true,
    json: true
  };

  const retrunData = await rp.post(url, {
    ...options,
    body: { ...data }
  });

  return retrunData;
};

export const GetRequest = async (url) => {
  const options = {
    withCredentials: true,
    json: true
  };

  const retrunData = await rp.get(url, {
    ...options,
  });

  return retrunData;
};
