import {DocumentActionProps, DocumentActionComponent} from 'sanity'
import {useState} from 'react'

export function customPublishConfirm(originalPublishAction: DocumentActionComponent) {
  const CustomPublishAction = (props: DocumentActionProps) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const originalResult = originalPublishAction(props)
    if (!originalResult) {
      return null
    }
    return {
      ...originalResult,
      onHandle: () => {
        setDialogOpen(true)
      },
      dialog: dialogOpen && {
        type: 'confirm',
        tone: 'critical',
        message: 'Are you sure you want to publish this document?',
        onCancel: () => {
          setDialogOpen(false)
        },
        onConfirm: () => {
          originalResult.onHandle?.()
          setDialogOpen(false)
        },
      },
    }
  }
  CustomPublishAction.action = 'publish'
  return CustomPublishAction
}
