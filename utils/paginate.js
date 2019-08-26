import url from 'url';
/* eslint-disable no-nested-ternary */
/**
 * function to return data needed for pagination
 * @export
 * @param {Number} count
 * @param {Number} limit
 * @param {Number} offset
 * @param {String} urlPath
 * @return {object} paginationData
 */
const paginate = (count, limit, offset, urlPath) => {
  const page = (offset > count) ? null : Math.floor(offset / limit) + 1;
  const pageCount = Math.ceil(count / limit);
  const pageSize = !page ? null : (count - offset) > limit ? limit : (count - offset);
  const nextOffset = (offset + limit > count) ? null : offset + limit;
  urlPath = url.parse(urlPath).pathname;
  const nextPageUrl = (nextOffset) ? `${urlPath}?limit=${limit}&offset=${nextOffset}` : null;

  return {
    page,
    pageCount,
    pageSize,
    count,
    nextPageUrl
  };
};

export default paginate;
