import { connect } from 'react-redux'
import RecommendTab from '../components/organisms/RecommendTab'
import { deleteTimeTable, updateMyTimeTableRequest } from '../store/ttrs/actions'

const mapStateToProps = (state) => {
  return {
    isMainPage: state.ttrs.isMainPage,
    currentTab: state.ttrs.currentTab,
    myTimeTable: state.ttrs.timeTable.myTimeTable,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateMyTimeTable: (myTimeTableId, updatedInfo, newLectureId) => {
      dispatch(updateMyTimeTableRequest(myTimeTableId, updatedInfo, newLectureId))
    },
    onDeleteTimeTable: (timeTableId, timeTableType) => {
      dispatch(deleteTimeTable(timeTableId, timeTableType))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecommendTab)
