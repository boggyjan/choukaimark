import action from '~/store/action'

export const state = () => ({
  videoList: [],
  /*{
    vid: '',
    title: '',
    marksCount: 0,
    //
    marks: [{
      {
        start: 0,
        end: 0,
        type: 0
      }
    }]
  }*/
  version: 1
})

export const getters = {
  videoList: state => {
    return state.videoList
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
  //
  // get video list
  getVideoList ({ commit, getters }) {
    var videoList = JSON.parse(localStorage.getItem(`${getters.localStorageName}_index`)) || []
    commit(action.common.updateVideoList, videoList)
  },
  //
  // remove video
  removeVideoById ({ commit, getters }, vid) {
    var videoList = Object.assign([], getters.videoList)
    var idx = videoList.findIndex(item => item.vid === vid)
    videoList.splice(idx, 1)
    localStorage.setItem(`${getters.localStorageName}_index`, JSON.stringify(videoList))
    localStorage.removeItem(`${getters.localStorageName}_video_${vid}`)
    commit(action.common.updateVideoList, videoList)
  },
  //
  // get single video data
  getVideoData ({ commit, getters, dispatch }, vid) {
    //
    if (!getters.videoList) {
      dispatch('getVideoList')
    }
    //
    var videoItem = getters.videoList.filter(item => item.vid === vid)
    var data
    if (videoItem && videoItem.length && videoItem.marks) {
      data = videoItem[0]
    } else {
      data = JSON.parse(localStorage.getItem(`${getters.localStorageName}_video_${vid}`)) || {
        vid,
        title: '',
        marks: []
      }
    }
    data.title = data.title ? data.title : ''
    data.marks = data.marks ? data.marks : []
    //
    commit(action.common.updateVideo, { vid, data })
    return data
  },
  //
  // set single video marks
  setVideoMarksById ({ commit, getters }, { vid, marks }) {
    var videoItem = JSON.parse(localStorage.getItem(`${getters.localStorageName}_video_${vid}`)) || {}
    videoItem.vid = vid
    videoItem.marks = marks
    localStorage.setItem(`${getters.localStorageName}_video_${vid}`, JSON.stringify(videoItem))
    //
    // list 部分
    //
    var videoList = JSON.parse(localStorage.getItem(`${getters.localStorageName}_index`)) || []
    var listItem = videoList.filter(item => item.vid === vid)
    if (listItem.length) {
      listItem[0].marksCount = marks.length
    } else {
      videoList.push({ vid, marksCount: marks.length })
    }
    localStorage.setItem(`${getters.localStorageName}_index`, JSON.stringify(videoList))
    //
    //
    commit(action.common.updateVideoMarks, { vid, marks })
  },
  //
  // set single video title
  setVideoTitleById ({ commit, getters }, { vid, title }) {
    var videoItem = JSON.parse(localStorage.getItem(`${getters.localStorageName}_video_${vid}`)) || {}
    videoItem.vid = vid
    videoItem.title = title
    localStorage.setItem(`${getters.localStorageName}_video_${vid}`, JSON.stringify(videoItem))
    //
    // list 部分
    //
    var videoList = JSON.parse(localStorage.getItem(`${getters.localStorageName}_index`)) || []
    var listItem = videoList.filter(item => item.vid === vid)
    if (listItem.length) {
      listItem[0].title = title
    } else {
      videoList.push({ vid, title })
    }
    localStorage.setItem(`${getters.localStorageName}_index`, JSON.stringify(videoList))
    //
    //
    commit(action.common.updateVideoTitle, { vid, title })
  }
}

export const mutations = {
  //
  [action.common.updateVideoList] (state, videoList) {
    state.videoList = videoList
  },
  //
  [action.common.updateVideo] (state, videoItem) {
    var videoItem = state.videoList.filter(item => item.vid === videoItem.vid)
    if (videoItem.length) {
      videoItem[0] = videoItem
    } else {
      state.videoList.push(videoItem)
    }
  },
  //
  [action.common.updateVideoMarks] (state, { vid, marks }) {
    var videoItem = state.videoList.filter(item => item.vid === vid)
    if (videoItem.length) {
      videoItem[0].marks = marks
    } else {
      state.videoList.push({ vid, marks })
    }
  },
  //
  [action.common.updateVideoTitle] (state, { vid, title }) {
    var videoItem = state.videoList.filter(item => item.vid === vid)
    if (videoItem.length) {
      videoItem[0].title = title
    } else {
      state.videoList.push({ vid, title })
    }
  }
}
