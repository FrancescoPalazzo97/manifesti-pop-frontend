import Slider from "../components/Slider";
import { useState, useEffect } from "react";
import axios from "axios";

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
                        <div className="row gy-4 p-3">
                            <div className="col-12">
                                <h2 className='fw-bold pt-5'>{mostSold.message}</h2>
                            </div>
                            <div className="col-12">
                                <Slider postersData={mostSold.data} />
                            </div>
                            <div className="col-12">
                                <h2 className='fw-bold'>{mostRecent.message}</h2>
                            </div>
                            <div className="col-12">
                                <Slider postersData={mostRecent.data} />
                            </div>
                        </div>
                    </div>

                </>
            )}
        </>
    );
};

export default HomePage;
