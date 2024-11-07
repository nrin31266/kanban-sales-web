import { APP } from '@/configurations/configurations'
import Head from 'next/head'
import React from 'react'

interface Props{
    title?: string
    image?: string
    url?: string
    description?:string
}

const HeadComponent = (props: Props) => {
    const {description,image,title,url} = props
  return (
    <Head>
        <title>{title ? title : APP.title}</title>
			<meta name='title' content={title ? title : APP.title} />
			<meta
				name='description'
				content={description ? description : APP.description}
			/>
			<meta property='og:type' content='website' />
			<meta property='og:url' content={url ?? ''} />
			<meta property='og:title' content={title ? title : APP.title} />
			<meta
				property='og:description'
				content={description ? description : APP.description}
			/>
			<meta property='og:site_name' content='YHocSo' />
			<meta property='fb:app_id' content='' />
			<meta property='og:image' content={image ?? ''} />
			<meta
				property='og:image:secure_url'
				content={image ? image : APP.logo}
			/>
			<meta property='og:image:width' content='402' />
			<meta property='og:image:height' content='321' />
			<meta property='og:image:type' content='image/png' />
			<meta name='twitter:title' content={title ? title : APP.title} />
			<meta
				name='twitter:description'
				content={description ? description : APP.description}
			/>
			<meta name='twitter:image' content={image ?? ''} /> 
    </Head>
  )
}

export default HeadComponent