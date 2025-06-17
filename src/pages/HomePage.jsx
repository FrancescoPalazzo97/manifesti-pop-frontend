import React from 'react'
import PosterCard from '../components/PosterCard'
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
        <>
            <div className="col-12 d-flex flex-column align-items-center justify-content-center text-center p-4 gap-3">
                <h1 className='display-4'>Manifesti POP</h1>
                <h5 className='text-muted'>I manifesti POP sono opere d'arte che celebrano la cultura popolare; questi manifesti catturano l'essenza della società contemporanea, per comunicare messaggi di critica sociale o semplicemente per celebrare la bellezza della vita quotidiana.</h5>
            </div>
            <div className='col-12'>
                <div className="row gy-4 p-3 align-items-stretch">
                    {posters.map((poster) => (
                        <div className="col-3 " key={poster.id}>
                            <PosterCard
                                title={poster.title}
                                artist={poster.artist}
                                size={poster.size}
                                price={poster.price}
                                image={poster.image_url}
                                slug={poster.slug}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default HomePage
