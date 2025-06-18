import Slider from "../components/Slider";
import HeroSpace from "../components/HeroSpace";
import { useState, useEffect } from "react";
import axios from "axios";
import LinkSection from "../components/LinkSection";

const HomePage = () => {
    const mostSoldAPI = `http://localhost:3000/posters/most-sold`
    const mostRecentAPI = `http://localhost:3000/posters/most-recent`
    // const [posters, setPosters] = useState([]);
    const [mostSold, setMostsold] = useState(null);
    const [mostRecent, setMostRecent] = useState(null);
    const [loading, setLoading] = useState(true);

    const linksToSections = [
        {
            id: `most-sold-posters`,
            text: `Poster più venduti`
        },
        {
            id: `most-recent-posters`,
            text: `Poster più recenti`
        }
    ]

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
                    <div className="row p-0">
                        <div className="col-12 p-0">
                            <HeroSpace />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            {linksToSections.map(linkToSection => (
                                <LinkSection linkToSection={linkToSection} />
                            ))}
                        </div>
                    </div>
                    <div id="most-sold-posters" className="row gy-4 p-3">
                        <div className="col-12 mt-5">
                            <h2 className='fw-bold pt-5'>{mostSold.message}</h2>
                        </div>
                        <div className="col-12">
                            <Slider postersData={mostSold.data} />
                        </div>
                    </div>
                    <div id="most-recent-posters" className="row gy-4 p-3">
                        <div className="col-12 mt-5">
                            <h2 className='fw-bold'>{mostRecent.message}</h2>
                        </div>
                        <div className="col-12">
                            <Slider postersData={mostRecent.data} />
                        </div>
                    </div>
                </>
            )
            }
        </>
    );
};

export default HomePage;
