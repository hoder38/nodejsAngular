import React from 'react'
import { RIGHT } from '../constants'
import ReCategorylist from '../containers/ReCategorylist'
import TopSection from './TopSection'
import Itemlist from './Itemlist'

export default function Storage() {
    return (
        <div>
            <ReCategorylist collapse={RIGHT} bookUrl="/api/bookmark/getlist/" bookDelUrl="/api/bookmark/del/" dirUrl="/api/parent/taglist/" dirDelUrl="/api/parent/del/" />
            <TopSection />
            <Itemlist />
        </div>
    )
}