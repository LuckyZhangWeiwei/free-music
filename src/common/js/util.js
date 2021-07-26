export function shuffle(arr) {
  let _arr = arr.slice();
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i);
    let t = _arr[i];
    _arr[i] = _arr[j];
    _arr[j] = t;
  }
  return _arr;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function debounce(func, timeRef, delay) {
  // let timer

  // return function (...args) {
  //   if (timer) {
  //     clearTimeout(timer)
  //   }
  //  timer = setTimeout(() => {
  //     func.apply(this, args)
  //   }, delay)
  // }

  return function (...args) {
    if (timeRef.current) {
      clearTimeout(timeRef.current);
    }
    timeRef.current = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

export function formatTime(time) {
  let interval = time | 0;
  const minute = (interval / 60) | 0;
  const second = pad(interval % 60);
  return `${minute}:${second}`;
}

export function pad(num, n = 2) {
  let len = num.toString().length;
  while (len < n) {
    num = "0" + num;
    len++;
  }
  return num;
}
