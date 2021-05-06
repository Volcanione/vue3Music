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
  } catch (error) {
    url = `https://music.163.com/song/media/outer/url?id=${id}.mp3 `
  }
  return url
}