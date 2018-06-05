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
  },
  bookmarkedTimeTables: [],
  receivedTimeTable: {
    id: null,
    title: '',
    memo: '',
    lectures: [],
    sender: null,
    receivedAt: null,
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
  count: null,
}

export const initialError = {
  signIn: {},
  signUp: {},
  settingsTab: {},
}

export const initialResponse = {
  settingsTab: 0,
}

export const initialState = {
  studentInfo: initialStudentInfo,
  belongInfo: initialBelongInfo,
  timeTable: initialTimeTable,
  search: initialSearch,
  error: initialError,
  response: initialResponse,
  toHome: false,
  toSignIn: false,
  semesters: [],
  year: null,
  semester: null,
  notRecommendCourses: [],
  evaluations: [],
  lectureDetail: {
    id: null,
    rate: null,
  },
}
