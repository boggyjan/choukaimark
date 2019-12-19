import action from '~/store/action'

export const state = () => ({
  userVideoLibrary: {},
  version: 1
})

export const getters = {
  userVideoLibrary: state => {
    return state.userVideoLibrary
  },
  version: state => {
    return state.version
  },
  localStorageName: state => {
    return `ckm_ds__v_${state.version}`
  }
}

export const actions = {
  //
  // server only
  // nuxtServerInit ({ commit }, { req, query }) {
  // }
  updateUserVideoLibrary ({ commit, getters }, userVideoLibrary) {
    localStorage.setItem(getters.localStorageName, JSON.stringify(userVideoLibrary))
    commit(action.common.updateUserVideoLibrary, userVideoLibrary)
  }
}

export const mutations = {
  //
  [action.common.updateUserVideoLibrary] (state, userVideoLibrary) {
    state.userVideoLibrary = userVideoLibrary
  }
}
