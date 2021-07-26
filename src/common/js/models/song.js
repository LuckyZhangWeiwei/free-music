import axios from "axios";
export class Song {
  constructor({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id;
    this.mid = mid;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.image = image;
    this.url = url;
  }
}

export function creatSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer), // filterSinger 中处理一遍
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: null,
  });
}

export function createSong2(musicData) {
  // console.log("musicData", musicData);
  return new Song({
    id: musicData.id,
    mid: null,
    singer: filterSinger(musicData.artists),
    name: musicData.name,
    album: musicData.album.name,
    duration: musicData.duration,
    image: musicData.artists[0].img1v1Url,
    url: null,
  });
}

function filterSinger(singer) {
  let ret = [];
  if (!singer) {
    return "";
  }
  singer.forEach((s) => {
    ret.push(s.name);
  });
  return ret.join("/");
}

export async function getSongUrl(songName) {
  const res1 = await axios.get(`/search?keywords=${songName}`);
  const songId = res1.data.result.songs[0].id;
  const res2 = await axios.get(`/song/url?id=${songId}`);
  const url = res2.config.url;
  const res3 = await axios.get(url);
  return res3.data.data[0].url;
}

export async function getLynic(songName) {
  const res1 = await axios.get(`/search?keywords=${songName}`);
  const songId = res1.data.result.songs[0].id;
  const res2 = await axios.get(`/lyric?id=${songId}`);
  return res2.data.lrc;
}
