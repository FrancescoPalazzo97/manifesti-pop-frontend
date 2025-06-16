import React from 'react'
import PosterCard from '../components/PosterCard'
import Navbar from '../components/Navbar'

const HomePage = () => {
    return (
        <div className='col-12'>
            <Navbar />
            <div className="row gy-4 p-3">
                <PosterCard />
            </div>
        </div>
    )
}

export default HomePage
