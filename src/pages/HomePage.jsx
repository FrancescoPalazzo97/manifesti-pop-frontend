import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import PosterCard from "../components/PosterCard";
import { useState, useEffect } from "react";
import axios from "axios";

const HomePage = () => {
    const mostSoldAPI = `http://localhost:3000/posters/most-sold`
    const mostRecentAPI = `http://localhost:3000/posters/most-recent`
    // const [posters, setPosters] = useState([]);
    const [mostSold, setMostsold] = useState([]);
    const [mostRecent, setMostRecent] = useState([]);
    const [loading, setLoading] = useState(true);

    const getMostSold = () => {
        axios.get(mostSoldAPI)
            .then(res => {
                setMostsold(res.data);
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
        if (mostRecent.length > 0 && mostSold.length > 0) {
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
                        {mostSold.map(poster => (
                            <SwiperSlide key={`most-sold-${poster.id}`}>
                                <PosterCard poster={poster} />
                            </SwiperSlide>
                        ))}
                    </Swiper>

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
                        {mostRecent.map(poster => (
                            <SwiperSlide key={`most-recent-${poster.id}`}>
                                <PosterCard poster={poster} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </>
            )}
        </>
    );
};

export default HomePage;
