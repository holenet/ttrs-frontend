import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Form, Menu, Popup, Segment, TextArea, Button } from 'semantic-ui-react'
import SearchLecture from '../../../containers/SearchLecture'

import TTRenderer from '../TTRenderer'

class TimeTable extends React.Component {
  state = {
    memo: this.props.memo,
    title: this.props.title,
    memoInput: this.props.memo,
    titleInput: this.props.title,
    isModifyingTitle: false,
    receiverName: '',
    isSending: false,
    isDeleting: false,
    searchOpen: false,
    openId: null,
    blocks: null,
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      memo: nextProps.memo,
      title: nextProps.title,
      memoInput: nextProps.memo,
      titleInput: nextProps.title,
    })
  }

  onSubmitMemo = () => {
    if (this.props.id === null) {
      console.log('There is no TimeTable')
      return
    }
    this.props.onModifyContent({ memo: this.state.memoInput })
    this.setState({
      memo: this.state.memoInput,
    })
  }

  onModifyTitle = () => {
    if (this.props.id === null) {
      console.log('There is no TimeTable')
      return
    }
    this.props.onModifyContent({ title: this.state.titleInput })
    this.setState({
      isModifyingTitle: false,
      title: this.state.titleInput,
    })
  }

  onSubmitSend = () => {
    if (this.props.username === this.state.receiverName) {
      this.props.onSendToSelf()
      return
    }
    const sendInfo = {
      timeTableId: this.props.id,
      receiverName: this.state.receiverName,
    }
    this.props.onSend(sendInfo)
  }

  createTimeTable = () => {
    return (
      <div>
        <TTRenderer
          type={this.props.type}
          id={this.props.id}
          lectures={this.props.lectures}
          canDeleteLecture={this.props.canModify}
          onDeleteLecture={this.props.onDeleteLecture}
          onChange={(blocks) => {
            if (this.props.onSelectBlocks) {
              this.props.onSelectBlocks(blocks)
            }
            this.setState({ blocks })
          }}
          haveSelection={this.props.haveSelection}
        />
      </div>
    )
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value })
  }

  render() {
    const iconButtonStyle = {
      backgroundColor: 'white',
      padding: 5,
    }

    return (
      <div>
        <Menu tabular attached="top">
          {this.props.id !== null ?
          <Menu.Item active fitted>
            {!this.state.isModifyingTitle ?
              <div style={{ paddingLeft: 10, paddingRight: 10 }}>
                <h4>
                  {this.props.haveSidebar &&
                  <Popup
                    trigger={<button
                      className="ui icon button"
                      onClick={this.props.onOpenSidebar}
                      style={iconButtonStyle}
                    >
                      <Icon name="list" />
                    </button>}
                    content="Show TimeTable List"
                    inverted
                  />
                  }
                  {this.props.isRecommended &&
                  <Popup
                    trigger={<button
                      className="ui icon button"
                      onClick={this.props.onShowPrevRecommend}
                      style={iconButtonStyle}
                    >
                      <Icon name="chevron left" />
                    </button>}
                    content="Show Previous TimeTable"
                    inverted
                  />
                  }
                  {this.props.title}
                  {this.props.canModify &&
                  <Popup
                    trigger={<button
                      className="ui icon button"
                      onClick={() => this.setState({ isModifyingTitle: true })}
                      style={iconButtonStyle}
                    >
                      <Icon name="pencil" />
                    </button>}
                    content="Modify title"
                    inverted
                  />}
                  {this.props.isRecommended &&
                  <Popup
                    trigger={<button
                      className="ui icon button"
                      onClick={this.props.onShowNextRecommend}
                      style={iconButtonStyle}
                    >
                      <Icon name="chevron right" />
                    </button>}
                    content="Show Next TimeTable"
                    inverted
                  />
                  }
                </h4>
              </div> :
              <Form>
                <Form.Input
                  action={
                    <Popup
                      trigger={<Form.Button
                        attached="right"
                        type="submit"
                        icon="save"
                        color="teal"
                        onClick={this.onModifyTitle}
                      />}
                      content="Save title"
                      inverted
                    />}
                  value={this.state.titleInput}
                  name="titleInput"
                  placeholder="Input title..."
                  onChange={this.handleChange}
                />
              </Form>
            }
          </Menu.Item> :
          <Menu.Item>
            {this.props.haveSelection && (this.props.canCreate || this.props.type === 'Recommended') &&
            <Popup
              position="bottom left"
              flowing
              trigger={<div><Icon name="lightbulb" />Selection</div>}
              header="You can select blocks by mouse dragging!"
              content={<div>
                {'Hold \'ctrl\' to unselect, \'shift\' to toggle blocks.'}<br />
                {'Select columns/rows or whole table by dragging table headers.'}
              </div>}
            />}
          </Menu.Item>}
          {this.props.id &&
          <Menu.Item>
            {this.props.isReceived &&
            <div>From {this.props.sender}&nbsp;&nbsp;&nbsp;&nbsp;</div>}
            {this.props.haveSelection &&
            <Popup
              position="bottom left"
              flowing
              trigger={<div><Icon name="lightbulb" />Selection</div>}
              header="You can select blocks by mouse dragging!"
              content={<div>
                {'Hold \'ctrl\' to unselect, \'shift\' to toggle blocks.'}<br />
                {'Select columns/rows or whole table by dragging table headers.'}
              </div>}
            />}
          </Menu.Item>}
          <Menu.Menu position="right">
            {this.props.canModify && (this.props.id !== null || this.props.canCreate) &&
            <Menu.Item active fitted>
              <Popup
                trigger={<div>
                  <Button
                    icon="add"
                    content="Add Lecture"
                    style={{ ...iconButtonStyle, paddingLeft: 10, paddingRight: 10 }}
                    onClick={() => this.setState({ searchOpen: true })}
                  />
                  {this.state.searchOpen &&
                  <SearchLecture
                    onAddLecture={this.props.onAddLecture}
                    onClose={() => this.setState({ searchOpen: false })}
                    blocks={this.state.blocks}
                    lectures={this.props.lectures}
                  />}
                </div>}
                content="Add a lecture to this timetable"
                inverted
              />
            </Menu.Item>}
            {this.props.id !== null &&
            <Menu.Item active fitted>
              <div style={{ paddingLeft: 10, paddingRight: 10 }}>
                {this.props.canCopyToMy &&
                <Popup
                  trigger={<button
                    className="ui icon button"
                    onClick={() => this.props.onCopyToMy(this.props.id)}
                    style={iconButtonStyle}
                  >
                    <Icon name="copy" />
                  </button>}
                  content="Copy this timetable to mine"
                  inverted
                />
                }
                <Popup
                  trigger={<button
                    className="ui icon button"
                    onClick={() => this.props.onBookmark(this.props.id)}
                    style={iconButtonStyle}
                  >
                    <Icon name="bookmark" />
                  </button>}
                  content="Bookmark this timetable"
                  inverted
                />
                <Popup
                  trigger={<button
                    className="ui icon button"
                    onClick={() => this.setState({ isSending: true })}
                    style={iconButtonStyle}
                  >
                    <Icon name="send" />
                  </button>}
                  content={this.state.isSending ?
                    <Form>
                      <Form.Input
                        action={<Form.Button
                          attached="right"
                          type="submit"
                          icon="send outline"
                          color="teal"
                          onClick={this.onSubmitSend}
                        />}
                        value={this.state.receiverName}
                        name="receiverName"
                        placeholder="Input receiver name..."
                        onChange={this.handleChange}
                      />
                    </Form> :
                    'Send this timetable to other student'}
                  onClose={() => this.setState({ isSending: false })}
                  on={this.state.isSending ? 'click' : 'hover'}
                  inverted={!this.state.isSending}
                />
                {this.props.canDelete &&
                <Popup
                  trigger={<button
                    className="ui icon button"
                    onClick={() => this.setState({ isDeleting: true })}
                    style={iconButtonStyle}
                  >
                    <Icon name="trash" color="red" />
                  </button>}
                  content={this.state.isDeleting ?
                    <Button
                      color="red"
                      content="Delete"
                      onClick={() => {
                        this.props.onDeleteTimeTable(this.props.id)
                        this.setState({ isDeleting: false })
                      }}
                    /> :
                    'Delete this timetable'}
                  onClose={() => this.setState({ isDeleting: false })}
                  on={this.state.isDeleting ? 'click' : 'hover'}
                  inverted={!this.state.isDeleting}
                />}
              </div>
            </Menu.Item>}
          </Menu.Menu>
        </Menu>
        <Segment attached>
          {this.createTimeTable()}
          {this.props.id !== null && this.props.canModify &&
          <Form>
            <Form.Field
              control={TextArea}
              label="Memo"
              placeholder="Leave some descriptions..."
              value={this.state.memoInput}
              name="memoInput"
              onChange={this.handleChange}
            />
            <Popup
              trigger={<Form.Button
                color="teal"
                onClick={this.onSubmitMemo}
              >Save</Form.Button>}
              content="Save memo"
              inverted
            />
          </Form>}
        </Segment>
      </div>
    )
  }
}

TimeTable.propTypes = {
  username: PropTypes.string,
  type: PropTypes.string,
  id: PropTypes.number,
  memo: PropTypes.string,
  title: PropTypes.string,
  lectures: PropTypes.array,
  canModify: PropTypes.bool,
  canCopyToMy: PropTypes.bool,
  canDelete: PropTypes.bool,
  canCreate: PropTypes.bool,
  haveSidebar: PropTypes.bool,
  isRecommended: PropTypes.bool,
  haveSelection: PropTypes.bool,
  isReceived: PropTypes.bool,
  sender: PropTypes.string,

  onCopyToMy: PropTypes.func,
  onBookmark: PropTypes.func,
  onSend: PropTypes.func,
  onSendToSelf: PropTypes.func,
  onModifyContent: PropTypes.func,
  onAddLecture: PropTypes.func,
  onDeleteLecture: PropTypes.func,
  onDeleteTimeTable: PropTypes.func,
  onOpenSidebar: PropTypes.func,
  onShowPrevRecommend: PropTypes.func,
  onShowNextRecommend: PropTypes.func,
  onSelectBlocks: PropTypes.func,
}

export default TimeTable
