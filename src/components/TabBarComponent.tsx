import { Typography } from 'antd';
import React, { ReactNode } from 'react'

interface Props{
    titleAlign: 'text-center' | 'text-right' | 'text-left';
    title: string;
    titleLevel: 1 | 2 | 3 | 4 | 5 | undefined;
    titleRight?: ReactNode

}

const TabBarComponent = (props : Props) => {
    const {title, titleAlign, titleLevel, titleRight} = props;
  return (
    <div>
        <div className="row p-2">
            <div className={`col ${titleAlign}`}>
                <Typography.Title level={titleLevel}>{title} </Typography.Title>
            </div>
            {titleRight && <div className='col-2 text-right'>{titleRight}</div>}
        </div>
    </div>
  )
}

export default TabBarComponent