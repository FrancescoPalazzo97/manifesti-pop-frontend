import React from 'react'
import PosterCard from '../components/PosterCard'
import Navbar from '../components/Navbar'
import { useState, useEffect } from 'react'
import axios from 'axios'


const HomePage = () => {

    const [posters, setPosters] = useState([])

    const fetchPoster = () => {
        axios
            .get('http://localhost:3000/posters')
            .then((resp) => {
                setPosters(resp.data)
            })
            .catch((err) => {
                console.log(err)
            })
    };

    useEffect(() => {
        fetchPoster();
    }, []);


    return (
        <div className='col-12'>
            <Navbar />
            <div className="row gy-4 p-3 align-items-stretch">
                {posters.map((poster) => (
                    <div className="col-3 " key={poster.id}>
                        <PosterCard
                            title={poster.title}
                            artist={poster.artist}
                            size={poster.size}
                            price={poster.price}
                            image={poster.image_url}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HomePage
