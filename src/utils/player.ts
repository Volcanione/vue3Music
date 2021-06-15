import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);
// 歌词转换

export function lyricRegular(lyric: string) {
  let str = lyric.split("\n")
  const PATTERN: any = /\[\d{2}:\d{2}(.\d{2,3})?\]/g
  // 判断是否有重复歌词
  str.forEach((item: any, index) => {
    if (!PATTERN.test(item)) {
      return
    }
    if (item.match(PATTERN).length >= 2) {
      const res = item.match(PATTERN).map((i: string) => {
        return i + item.replace(PATTERN, "")
      });
      str[index] = ""
      str.push(...res)
    }
  })
  str = str.filter((item) => item !== "")
  str.sort((a: any, b: any) => {
    const timea = a.split("]")[0].replace("[", "")
    const timeb = b.split("]")[0].replace("[", "")
    return initTime(timea) - initTime(timeb)
  });

  const lyricArr: any = str
    .map((item: any) => {
      return {
        time: PATTERN.test(item)
          ? item.match(PATTERN)[0].replace(/\[/, "").replace(/\]/, "")
          : NaN,
        lyricText: PATTERN.test(item) ? item.replace(PATTERN, "") : "---",
      }
    })
    .filter((i) => i.lyricText !== "---")
  lyricArr.forEach((item: any, index: number) => {
    if (index === lyricArr.length - 1 && item.lyricText === "") {
      lyricArr.pop()
    }
  })
  lyricArr.sort((i: any, v: any) => {
    if (i.time === v.time) {
      const idx = lyricArr.findIndex((m: any) => m.time === i.time)
      v.time = dayjs
        .unix(initTime(v.time) + (idx + 1) * 0.5)
        .format("mm:ss.SSS")
    }
  })
  return lyricArr
}

export function NextTimeArray(currentTime: string | number, TimeArray: any[]) {
  const currentTimeArray = TimeArray.map((item) => {
    return {
      time: initTime(item.time),
      lyricText: item.lyricText,
    }
  });
  let idx = currentTimeArray.findIndex((item: any) => {
    return item.time > currentTime
  });

  if (idx >= 0) {
    idx = Math.max(0, idx - 1)
  } else {
    idx = currentTimeArray.length - 1
  }
  return idx
}

//歌词同步处理函数
export const initTime = (item: any) => {
  const minutes = item.split(":")[0]
  const seconds = item.split(":")[1]
  return dayjs.duration({ minutes, seconds }).asSeconds()
};
