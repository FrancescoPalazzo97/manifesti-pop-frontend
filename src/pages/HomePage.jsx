import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import PosterCard from "../components/PosterCard";
import { useState, useEffect } from "react";
import axios from "axios";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const HomePage = () => {
    const mostSoldAPI = `http://localhost:3000/posters/most-sold`
    const mostRecentAPI = `http://localhost:3000/posters/most-recent`
    // const [posters, setPosters] = useState([]);
    const [mostSold, setMostsold] = useState(null);
    const [mostRecent, setMostRecent] = useState(null);
    const [loading, setLoading] = useState(true);

    const getMostSold = () => {
        axios.get(mostSoldAPI)
            .then(res => {
                setMostsold(res.data);
            })
            .catch(err => {
                console.log(`Errore: ${err}`)
            })
    }

    const getMostRecent = () => {
        axios.get(mostRecentAPI)
            .then(res => {
                setMostRecent(res.data);
            })
            .catch(err => {
                console.log(`Errore: ${err}`)
            })
    }

    useEffect(() => {
        getMostSold();
        getMostRecent();
    }, []);

    useEffect(() => {
        if (mostRecent && mostSold) {
            setLoading(false)
            console.log(mostSold, mostRecent)
        }
        console.log(mostSold, mostRecent)
    }, [mostRecent, mostSold])

    return (
        <>
            {loading ? (
                <>Caricamento...</>
            ) : (
                <>
                    <div className="col-12">
                        <div className="row py-5 px-3">
                            <div className="col-12 trasparent-bg">
                                <h2 className='fw-bold'>{mostSold.message}</h2>
                            </div>
                            <div className="col-12">
                                <Swiper
                                    slidesPerView={4}
                                    spaceBetween={30}
                                    grabCursor={true}
                                    navigation={true}
                                    breakpoints={{
                                        320: {
                                            slidesPerView: 1,
                                            spaceBetween: 10,
                                        },
                                        640: {
                                            slidesPerView: 2,
                                            spaceBetween: 20,
                                        },
                                        768: {
                                            slidesPerView: 4,
                                            spaceBetween: 30,
                                        }
                                    }}
                                    modules={[Pagination, Navigation]}
                                    className="mySwiper"
                                >
                                    {mostSold.data.map(poster => (
                                        <SwiperSlide key={`most-sold-${poster.id}`}>
                                            <PosterCard poster={poster} slider={true} />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                            <div className="col-12 trasparent-bg">
                                <h2 className='fw-bold'>{mostRecent.message}</h2>
                            </div>
                            <div className="col-12">
                                <Swiper
                                    slidesPerView={4}
                                    spaceBetween={30}
                                    grabCursor={true}
                                    navigation={true}
                                    breakpoints={{
                                        320: {
                                            slidesPerView: 1,
                                            spaceBetween: 10,
                                        },
                                        640: {
                                            slidesPerView: 2,
                                            spaceBetween: 20,
                                        },
                                        768: {
                                            slidesPerView: 4,
                                            spaceBetween: 30,
                                        }
                                    }}
                                    modules={[Pagination, Navigation]}
                                    className="mySwiper"
                                >
                                    {mostRecent.data.map(poster => (
                                        <SwiperSlide key={`most-recent-${poster.id}`}>
                                            <PosterCard poster={poster} slider={true} />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                    </div>

                </>
            )}
        </>
    );
};

export default HomePage;
