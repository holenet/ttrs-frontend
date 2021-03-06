import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Modal, Card, Pagination, Icon, Grid, Divider, Dimmer, Loader } from 'semantic-ui-react'
import Lecture from '../../../containers/Lecture'
import { compressBlocks } from '../../../services/parser'

const limit = 6

class SearchLecture extends React.Component {
  state = {
    'course.name.abbrev': '',
    'course.code': '',
    instructor: '',
    collegeIndex: null,
    departmentIndex: null,
    majorIndex: null,
    order_by: null,
    'course.type': null,
    'course.grade': null,
    'course.credit.gte': null,
    'course.credit.lte': null,
    'course.field.startswith': null,
    'course.field.endswith': null,
    selectBlocks: false,
    emptyTime: false,
    page: 1,
  }

  getIntersects = (lectures, lecture) => {
    const intersects = []
    lectures.forEach((other) => {
      let intersect = false
      other.timeSlots.forEach((slot1) => {
        lecture.timeSlots.forEach((slot2) => {
          if (slot1.dayOfWeek === slot2.dayOfWeek) {
            if (slot1.endTime > slot2.startTime && slot1.startTime < slot2.endTime) {
              intersect = true
            }
          }
        })
      })
      if (intersect) {
        intersects.push(other)
      }
    })
    return intersects
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value })
  }

  handleToggle = (e, { name, checked }) => {
    this.setState({ [name]: checked })
  }

  handleSearchLecture = (page = 1) => {
    const options = {
      limit,
      offset: (page - 1) * limit,
    }
    if (this.state['course.name.abbrev']) {
      options['course.name.abbrev'] = this.state['course.name.abbrev']
    }
    if (this.state['course.code']) {
      options['course.code'] = this.state['course.code']
    }
    if (this.state.instructor) {
      options.instructor = this.state.instructor
    }
    if (this.state.collegeIndex !== null) {
      options['course.college'] = this.props.colleges[this.state.collegeIndex].id
      if (this.state.departmentIndex !== null) {
        options['course.department'] = this.props.colleges[this.state.collegeIndex].departments[this.state.departmentIndex].id
        if (this.state.majorIndex !== null) {
          options['course.major'] = this.props.colleges[this.state.collegeIndex].departments[this.state.departmentIndex].majors[this.state.majorIndex].id
        }
      }
    }
    if (this.state.order_by) {
      options.order_by = this.state.order_by
    }
    if (this.state['course.type']) {
      options['course.type'] = this.state['course.type']
    }
    if (this.state['course.grade']) {
      options['course.grade'] = this.state['course.grade']
    }
    if (this.state['course.credit.gte']) {
      options['course.credit.gte'] = this.state['course.credit.gte']
    }
    if (this.state['course.credit.lte']) {
      options['course.credit.lte'] = this.state['course.credit.lte']
    }
    if (this.state['course.field.startswith']) {
      options['course.field.startswith'] = this.state['course.field.startswith']
    }
    if (this.state['course.field.endswith']) {
      options['course.field.endswith'] = this.state['course.field.endswith']
    }
    let blocks = null
    if (this.state.selectBlocks) {
      blocks = this.props.blocks
    }
    if (this.state.emptyTime) {
      if (blocks === null) {
        blocks = []
        for (let i = 0; i < 24; i += 1) {
          blocks.push([])
          for (let j = 0; j < 6; j += 1) {
            blocks[i].push(true)
          }
        }
      }
      this.props.lectures.forEach(lecture => {
        lecture.timeSlots.forEach(slot => {
          const dayIndex = ['월', '화', '수', '목', '금', '토'].indexOf(slot.dayOfWeek)

          let startTime = slot.startTime.split(':').map((i) => Number(i))
          startTime = (Math.floor((((startTime[0] * 60) + startTime[1]) - 1) / 30) + 1) - 18

          let endTime = slot.endTime.split(':').map((i) => Number(i))
          endTime = (Math.floor((((endTime[0] * 60) + endTime[1]) - 1) / 30) + 1) - 18

          for (let i = startTime; i < endTime; i += 1) {
            blocks[i][dayIndex] = false
          }
        })
      })
    }
    if (blocks !== null) {
      options.blocks = compressBlocks(blocks)
    }
    this.props.onSearchLecture(options)
  }

  handlePageChange = (e, { activePage }) => {
    this.setState({ page: activePage })
    this.handleSearchLecture(activePage)
  }

  render() {
    const collegeOptions = [{ key: -1, text: '---', value: null }]
    collegeOptions.push(...this.props.colleges.map((college, index) => ({
      key: college.id,
      text: college.name,
      value: index,
    })))
    const departmentOptions = [{ key: -1, text: '---', value: null }]
    if (this.state.collegeIndex !== null) {
      departmentOptions.push(...this.props.colleges[this.state.collegeIndex].departments.map((department, index) => ({
        key: department.id,
        text: department.name,
        value: index,
      })))
    }
    const majorOptions = [{ key: -1, text: '---', value: null }]
    if (this.state.departmentIndex !== null) {
      majorOptions.push(...this.props.colleges[this.state.collegeIndex].departments[this.state.departmentIndex].majors.map((major, index) => ({
        key: major.id,
        text: major.name,
        value: index,
      })))
    }
    const orderOptions = [
      { key: -1, text: '---', value: null },
      { key: '-rating', text: '평점 높은순', value: '-rating' },
      { key: 'rating', text: '평점 낮은순', value: 'rating' },
    ]
    const creditOptions = [{ key: -1, text: '---', value: null }]
    creditOptions.push(...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(credit => ({ key: credit, text: credit, value: credit })))
    const typeOptions = [{ key: -1, text: '---', value: null }]
    typeOptions.push(...this.props.types.map(type => ({ key: type, text: type, value: type })))
    const gradeOptions = [{ key: -1, text: '---', value: null }]
    gradeOptions.push(...[1, 2, 3, 4, 5, 6].map(grade => ({ key: grade, text: grade, value: grade })))
    const fieldStartOptions = [{ key: -1, text: '---', value: null }]
    fieldStartOptions.push(...Object.keys(this.props.fields).map(field => ({ key: field, text: field, value: field })))
    const fieldEndOptions = [{ key: -1, text: '---', value: null }]
    if (this.state['course.field.startswith']) {
      fieldEndOptions.push(...this.props.fields[this.state['course.field.startswith']].map(field => ({
        key: field,
        text: field,
        value: field,
      })))
    }
    return (
      <div>
        <Modal
          open
          size="large"
          style={{
            marginTop: '0px !important',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
          closeOnDimmerClick={false}
        >
          <Modal.Header>
            Search Lecture
          </Modal.Header>
          <Modal.Content>
            <Form
              id="form"
              onSubmit={() => {
                this.setState({ page: 1 })
                this.handleSearchLecture()
              }}
            >
              <Grid>
                <Grid.Row columns={5} style={{ marginTop: -10 }}>
                  <Grid.Column>
                    <Form.Input
                      label="Course Name"
                      placeholder="Course Name"
                      name="course.name.abbrev"
                      onChange={this.handleChange}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Input
                      label="Course Code"
                      placeholder="Course Code"
                      name="course.code"
                      onChange={this.handleChange}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Input
                      label="Instructor"
                      placeholder="Instructor"
                      name="instructor"
                      onChange={this.handleChange}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Group inline>
                      <Form.Select
                        fluid
                        label="Credit"
                        placeholder="Min"
                        options={creditOptions}
                        name="course.credit.gte"
                        value={this.state['course.credit.gte']}
                        onChange={this.handleChange}
                      />
                      <span style={{ marginTop: 20 }}>&nbsp;~&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      <Form.Select
                        fluid
                        label="&nbsp;"
                        placeholder="Max"
                        options={creditOptions}
                        name="course.credit.lte"
                        value={this.state['course.credit.lte']}
                        onChange={this.handleChange}
                      />
                    </Form.Group>
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Radio
                      style={{ marginTop: 25 }}
                      label="Empty Area Only"
                      toggle
                      name="emptyTime"
                      checked={this.state.emptyTime}
                      onChange={this.handleToggle}
                    />
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row columns={5} style={{ marginTop: -30 }}>
                  <Grid.Column>
                    <Form.Select
                      fluid
                      label="College"
                      placeholder="College"
                      options={collegeOptions}
                      name="collegeIndex"
                      value={this.state.collegeIndex}
                      onChange={(e, { name, value }) => {
                        this.setState({ [name]: value })
                        this.setState({ departmentIndex: null })
                        this.setState({ majorIndex: null })
                      }}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Select
                      fluid
                      label="Department"
                      placeholder="Department"
                      options={departmentOptions}
                      name="departmentIndex"
                      value={this.state.departmentIndex}
                      onChange={(e, { name, value }) => {
                        this.setState({ [name]: value })
                        this.setState({ majorIndex: null })
                      }}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Select
                      fluid
                      label="Major"
                      placeholder="Major"
                      options={majorOptions}
                      name="majorIndex"
                      value={this.state.majorIndex}
                      onChange={this.handleChange}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Select
                      fluid
                      label="Order"
                      placeholder="Order"
                      options={orderOptions}
                      name="order_by"
                      value={this.state.order_by}
                      onChange={this.handleChange}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Radio
                      style={{ marginTop: 30 }}
                      label="Selected Area Only"
                      toggle
                      name="selectBlocks"
                      checked={this.state.selectBlocks}
                      onChange={this.handleToggle}
                    />
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row columns={5} style={{ marginTop: -20 }}>
                  <Grid.Column>
                    <Form.Select
                      fluid
                      label="Type"
                      placeholder="Type"
                      options={typeOptions}
                      name="course.type"
                      value={this.state['course.type']}
                      onChange={this.handleChange}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Select
                      fluid
                      label="Grade"
                      placeholder="Grade"
                      options={gradeOptions}
                      name="course.grade"
                      value={this.state['course.grade']}
                      onChange={this.handleChange}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Select
                      fluid
                      label="Field"
                      placeholder="Field"
                      options={fieldStartOptions}
                      name="course.field.startswith"
                      value={this.state['course.field.startswith']}
                      onChange={(e, { name, value }) => {
                        this.setState({ [name]: value })
                        this.setState({ 'course.field.endswith': null })
                      }}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Select
                      fluid
                      label="Field Detail"
                      placeholder="Field Detail"
                      options={fieldEndOptions}
                      name="course.field.endswith"
                      value={this.state['course.field.endswith']}
                      onChange={this.handleChange}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Button
                      style={{ float: 'right', marginTop: 23 }}
                      color="teal"
                      type="submit"
                      content="Search"
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Form>
            <Divider />
          </Modal.Content>
          <div className="scrolling content">
            <Dimmer active={this.props.searchLectureLoading} inverted>
              <Loader>Loading</Loader>
            </Dimmer>
            <Card.Group itemsPerRow={3} doubling stackable>
              {this.props.searchLectures.map(lecture =>
                <Lecture
                  key={lecture.id}
                  lecture={lecture}
                  onAddLecture={() => this.props.onAddLecture(lecture.id)}
                  intersects={this.getIntersects(this.props.lectures, lecture)}
                />
              )}
            </Card.Group>
          </div>
          <Modal.Actions>
            {this.props.count > 0 &&
            <div align="center">
              <Pagination
                ellipsisItem={{ content: <Icon name="ellipsis horizontal" />, icon: true }}
                firstItem={{ content: <Icon name="angle double left" />, icon: true }}
                lastItem={{ content: <Icon name="angle double right" />, icon: true }}
                prevItem={{ content: <Icon name="angle left" />, icon: true }}
                nextItem={{ content: <Icon name="angle right" />, icon: true }}
                totalPages={Math.floor((this.props.count - 1) / limit) + 1}
                activePage={this.state.page}
                onPageChange={this.handlePageChange}
                siblingRange={3}
              />
            </div>}
            <Button onClick={this.props.onClose} content="Close" />
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}

SearchLecture.propTypes = {
  searchLectures: PropTypes.array,
  count: PropTypes.number,
  colleges: PropTypes.array,
  fields: PropTypes.object,
  types: PropTypes.array,
  blocks: PropTypes.array,
  lectures: PropTypes.array,
  searchLectureLoading: PropTypes.bool,

  onSearchLecture: PropTypes.func,
  onClose: PropTypes.func,
  onAddLecture: PropTypes.func,
}

export default SearchLecture
