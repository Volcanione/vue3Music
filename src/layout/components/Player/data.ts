import api from '@/api/index'
export async function getMusicPlayUrl(id: string | number) {
  let url = ''
  try {
    const res = await api.checkMusic({ id })
    if (res.message !== 'ok') {
      return ''
    }
    const { code, data } = await api.getMusicUrl({ id })
    url = code === 200 ? data[0].url : ''
    // url = `https://music.163.com/song/media/outer/url?id=${id}.mp3 `
  } catch (error) {
    url = `https://music.163.com/song/media/outer/url?id=${id}.mp3 `
  }
  return url
}


export async function getMusicLyric(params: string | number) {
  const { code, lrc, tlyric } = await api.getlyric({ id: params })
  if (code !== 200) {
    return null
  }
  const lyric_0 = lrc?.lyric || null
  const lyric_1 = tlyric?.lyric || null
  return { lyric_0, lyric_1 }
}

export async function getLikeList(uid: string | number) {
  try {
    const { code, ids } = await api.getLikelist({ uid })
    return code === 200 ? ids : []
  } catch (error) {
    return []
  }
}


export async function setLike(id: number | string, like: boolean) {
  try {
    const { code } = await api.likeMusic({ id, like })
    return code === 200 ? like : null
  } catch (error) {
    return null
  }
}