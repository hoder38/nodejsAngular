import React from 'react'
import { RIGHT } from '../constants'
import ReCategorylist from '../containers/ReCategorylist'
import ReTopSection from '../containers/ReTopSection'
import ReItemlist from '../containers/ReItemlist'

export default function Storage() {
    return (
        <div>
            <ReCategorylist collapse={RIGHT} bookUrl="/api/bookmark/getlist/" bookDelUrl="/api/bookmark/del/" dirUrl="/api/parent/taglist/" dirDelUrl="/api/parent/del/" />
            <ReTopSection />
            <ReItemlist />
        </div>
    )
}