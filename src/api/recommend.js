import axios from "axios";

export function getRecommend() {
  const url = "/dj/banner";
  return axios
    .get(url, {
      params: null,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    });
}

export function getDiscList() {
  const url = "/top/playlist/highquality?limit=20";
  return axios
    .get(url, {
      params: null,
    })
    .then((res) => {
      return Promise.resolve(res.data);
    });
}

export function getDiscDetail(discId) {
  const url = `/playlist/detail?id=${discId}`;
  return axios.get(url).then((res) => {
    return Promise.resolve(res.data);
  });
}
