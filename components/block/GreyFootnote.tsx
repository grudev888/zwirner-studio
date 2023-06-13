export const GreyFootNote = () => {
  return <span style={{fontWeight: 'bold'}}>G</span>
}

export const GreyFootNoteDecorator = (props: any) => (
  <span style={{color: 'gray'}}>{props.children}</span>
)
