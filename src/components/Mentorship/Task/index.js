import { Button, Card, Empty, Progress } from 'antd'
import React from 'react'
import { useSelector } from 'react-redux'
import SortableTree from 'react-sortable-tree'
import TaskBucket from './TaskBucket'
import TaskRow from './TaskRow'

const TaskComponent = ({
  activeTaskBucket,
  addEmptyTask,
  addTaskBucket,
  deleteOneTask,
  deleteOneTaskBucket,
  isEditable,
  progressNumber,
  rearrangeTasks,
  showTasks,
  taskBuckets,
  updateActiveTasks,
  updateOneTask,
}) => {
  const user = useSelector(state => state.user)

  return (
    <Card title="Tasks">
      <div className="row">
        <div className="col-12 col-md-3 d-flex align-items-start justify-content-center flex-column mb-md-4">
          <TaskBucket
            taskBuckets={taskBuckets}
            showTasks={showTasks}
            activeTaskBucket={activeTaskBucket}
            deleteOneTaskBucket={deleteOneTaskBucket}
            addTaskBucket={addTaskBucket}
            isEditable={isEditable}
          />
        </div>
        <div className="col-12 col-md-9 align-items-center justify-content-center flex-col">
          <div className="row d-flex align-items-center justify-content-between">
            <div className="col-xs-12 col-lg-10 p-2">
              <span style={{ fontSize: '18px', fontWeight: 'bold', marginRight: '12px' }}>
                Task Progress
              </span>
              <Progress percent={progressNumber} status="active" />
            </div>
            <div className="col-xs-12 col-lg-2">
              <Button
                type="primary"
                block
                onClick={() => addEmptyTask()}
                disabled={taskBuckets.length === 0 || !isEditable}
              >
                Add Task
              </Button>
            </div>
          </div>
          <div className="col-12 d-flex align-items-center justify-content-center height-400">
            {activeTaskBucket.tasks.length === 0
              ? console.log('activeTaskasket length = 0')
              : console.log('activeTaskbasket length >0')}
            {activeTaskBucket.tasks.length > 0 ? (
              <SortableTree
                treeData={activeTaskBucket.tasks}
                onChange={treeD => {
                  rearrangeTasks(treeD)
                }}
                generateNodeProps={({ node }) => ({
                  title: !node.children ? ( // will throw error if this check isnt there
                    <TaskRow
                      node={node}
                      accessToken={user.accessToken}
                      updateOneTask={updateOneTask}
                      updateActiveTasks={updateActiveTasks}
                      deleteOneTask={deleteOneTask}
                      isEditable={isEditable}
                    />
                  ) : (
                    <span>{node.body}:</span>
                  ),
                })}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_DEFAULT}
                imageStyle={{ height: 300, width: 300 }}
                description="Add a new task"
              />
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default TaskComponent
