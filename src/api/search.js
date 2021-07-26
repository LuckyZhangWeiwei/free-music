import axios from "axios";

export function getHotSearchTag() {
  const url = "/search/hot/";
  return axios.get(url).then((res) => {
    return Promise.resolve(res.data);
  });
}

export function search(query, page, zhida, limit) {
  return axios
    .get(`/search?keywords=${query}&limit=${limit}&offset=${page}`)
    .then((res) => {
      return res.data;
    });
}
