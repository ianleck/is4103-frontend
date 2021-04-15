import { Button, Card, Collapse, Empty, Form, Input } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import {
  formatTime,
  onFinishFailed,
  showNotification,
  sortDescAndKeyNoteId,
} from 'components/utils'
import {
  ERROR,
  NOTE_ADD_ERR,
  NOTE_ADD_SUCCESS,
  NOTE_EDIT_ERR,
  NOTE_EDIT_SUCCESS,
  SUCCESS,
} from 'constants/notifications'
import { isEmpty, isNil, map } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { createNote, getAllNotes, updateNote } from 'services/mentorship/contracts'

const NotesComponent = ({ isEditable }) => {
  const { id } = useParams()
  const [notes, setNotes] = useState([])
  const [isEditMode, setIsEditMode] = useState(false)
  const [activeNoteId, setActiveNoteId] = useState('')
  const [noteForm] = Form.useForm()
  const [, forceUpdate] = useState({})

  const { Panel } = Collapse

  const getNotes = async () => {
    const response = await getAllNotes(id)
    if (response && !isNil(response.notes)) {
      setNotes(sortDescAndKeyNoteId(response.notes))
    }
  }

  useEffect(() => {
    getNotes()
    forceUpdate({}) // required to disable 'submit' button of the form at the beginning

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onReset = () => {
    noteForm.resetFields()
    setActiveNoteId('')
    setIsEditMode(false)
  }

  const onFinishNoteForm = async values => {
    if (isEditMode) {
      const payload = {
        noteId: activeNoteId,
        note: { title: values.noteTitle, body: values.noteBody },
      }

      const response = await updateNote(payload)

      if (response && !isNil(response.note)) {
        showNotification('success', SUCCESS, NOTE_EDIT_SUCCESS)
        getNotes()
        onReset()
      } else {
        showNotification('error', ERROR, NOTE_EDIT_ERR)
      }
    } else {
      const payload = {
        mentorshipContractId: id,
        note: { title: values.noteTitle, body: values.noteBody },
      }

      const response = await createNote(payload)

      if (response && !isNil(response.note)) {
        showNotification('success', SUCCESS, NOTE_ADD_SUCCESS)
        noteForm.resetFields()
        getNotes()
      } else {
        showNotification('error', ERROR, NOTE_ADD_ERR)
      }
    }
  }

  const onEditNote = noteToEdit => {
    noteForm.setFieldsValue({ noteTitle: noteToEdit.title, noteBody: noteToEdit.body })
    setActiveNoteId(noteToEdit.noteId)
    setIsEditMode(true)
  }

  const NoteFormComponent = () => {
    return (
      <div className="row mt-4">
        <div className="col-12">
          <Form
            layout="vertical"
            form={noteForm}
            id="noteForm"
            onSubmit={e => e.preventDefault()}
            onFinish={onFinishNoteForm}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              name="noteTitle"
              label="Note Title"
              rules={[{ required: true, message: 'Please input a note title' }]}
            >
              <Input disabled={!isEditable} />
            </Form.Item>
            <Form.Item
              name="noteBody"
              label="Note Content"
              rules={[{ required: true, message: 'Please input note content' }]}
            >
              <TextArea autoSize={{ minRows: 5, maxRows: 10 }} disabled={!isEditable} />
            </Form.Item>
            <Form.Item shouldUpdate>
              {() => (
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={
                    !noteForm.isFieldsTouched() ||
                    !!noteForm.getFieldsError().filter(({ errors }) => errors.length).length
                  }
                >
                  {isEditMode ? 'Edit this Note' : 'Add New Note'}
                </Button>
              )}
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }

  return (
    <Card title="Notes">
      <div className="row d-flex align-items-center justify-content-center mb-md-4">
        <div className="col-12 col-md-4 border-right">
          <NoteFormComponent />
        </div>
        <div className="col-12 col-md-8">
          {isEmpty(notes) ? (
            <Empty description="No notes yet" />
          ) : (
            <Collapse ghost>
              {map(notes, note => {
                return (
                  <Panel header={note.title} key={note.key}>
                    <p>{note.body}</p>
                    <div>
                      <div className="row">
                        <div className="col-12">
                          <small className="text-muted text-uppercase">
                            {`Created on: ${formatTime(note.createdAt)}`}
                          </small>
                        </div>
                      </div>
                      <div className="row mt-2">
                        <div className="col-12">
                          <small className="text-muted text-uppercase">
                            {`Last Updated on: ${formatTime(note.updatedAt)}`}
                          </small>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      {isEditable &&
                        (activeNoteId !== note.noteId ? (
                          <Button onClick={() => onEditNote(note)}>Edit this note</Button>
                        ) : (
                          <Button onClick={() => onReset()}>Cancel editing this note</Button>
                        ))}
                    </div>
                  </Panel>
                )
              })}
            </Collapse>
          )}
        </div>
      </div>
    </Card>
  )
}

export default NotesComponent
