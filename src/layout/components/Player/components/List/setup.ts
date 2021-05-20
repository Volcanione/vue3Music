import { ref, computed, reactive, toRef } from 'vue'
import user from '@/api/user'
import { useStore } from 'vuex'

export function listSetUp() {
  const userPlayList = ref([])
  const store = useStore()

  const getUserRecord = async () => {
    
    const userId = computed(() => store.getters.userInfo.userId);
    const param = reactive({
      uid: userId
    })

    if (!param.uid) {
      const { code, profile } = await user.getUserInfo()
      if (code == 200 && profile) {
        Object.assign(param, { uid: ref(profile.userId) })
        store.commit('user/setUserInfo', profile)
      }
      if (!profile || code !== 200) {
        return userPlayList.value = []
      }
    }

    const { code: code2, allData } = await user.getUserRecord(param)
    userPlayList.value = code2 === 200 ? allData.map(({ song: { name, id, ar, al } }: any) => {
      return {
        id,
        name,
        artists: ar[0].name,
        img: al.picUrl
      }
    }) : []
  }



  return {
    userPlayList,
    getUserRecord,
  }
}