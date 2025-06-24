import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import PosterCard from "../components/PosterCard";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const Slider = ({ postersData }) => {
    return (
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
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                1200: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                },
                1400: {
                    slidesPerView: 4,
                    spaceBetween: 30,
                }
            }}
            modules={[Pagination, Navigation]}
            className="mySwiper"
        >
            {postersData.map(poster => (
                <SwiperSlide key={`most-sold-${poster.id}`}>
                    <div className="col">
                        <PosterCard poster={poster} slider={true} />
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

export default Slider
