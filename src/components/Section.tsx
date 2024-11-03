
import React, { ReactNode } from 'react'

interface Props{
    children: ReactNode
    styles?: React.CSSProperties
}

const Section = (props: Props) => {
    const {children, styles} = props;
  return (
    <div className='section' style={styles}>{children}</div>
  )
}

export default Section