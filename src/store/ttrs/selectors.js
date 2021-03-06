export const initialStudentInfo = {
  id: null,
  username: null,
  password: null,
  email: null,
  grade: null,
  college: null,
  department: null,
  major: null,
  notRecommends: [],
  myTimeTables: [],
  bookmarkedTimeTables: [],
  receivedTimeTables: [],
}

export const initialBelongInfo = {
  colleges: [],
}

export const initialTimeTable = {
  myTimeTable: {
    id: null,
    title: '',
    memo: '',
    lectures: [],
  },
  bookmarkedTimeTable: {
    id: null,
    title: '',
    memo: '',
    lectures: [],
    creditSum: 0,
  },
  bookmarkedTimeTables: [],
  receivedTimeTable: {
    id: null,
    title: '',
    memo: '',
    lectures: [],
    sender: null,
    receivedAt: null,
    creditSum: 0,
  },
  receivedTimeTables: [],
  recommendedTimeTable: {
    id: null,
    title: '',
    memo: '',
    lectures: [],
  },
  recommendedTimeTables: [],
}

export const initialSearch = {
  lectures: [],
  count: 0,
}

export const initialErrorUnit = {
  bools: {},
  texts: {},
}

export const initialError = {
  signIn: initialErrorUnit,
  signUp: initialErrorUnit,
  settingsTab: initialErrorUnit,
}

export const initialNotice = {
  lastId: 0,
  notices: [],
}

export const initialLoading = {
  myTimeTableLoading: false,
  bookmarkedTimeTableLoading: false,
  receivedTimeTableLoading: false,
  recommendedTimeTableLoading: false,
  notRecommendsLoading: false,
  evaluationsLoading: false,
  searchLectureLoading: false,
  updateProfileLoading: false,
}

export const initialState = {
  loaded: false,
  studentInfo: initialStudentInfo,
  belongInfo: initialBelongInfo,
  timeTable: initialTimeTable,
  search: initialSearch,
  error: initialError,
  notice: initialNotice,
  loading: initialLoading,
  toGo: null,
  semesters: [],
  year: null,
  semester: null,
  notRecommendCourses: [],
  evaluations: [],
  lectureDetail: {
    id: null,
    rating: 0,
  },
  fields: {},
  types: [],
}
