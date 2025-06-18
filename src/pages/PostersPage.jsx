import { useGlobalContext } from "../contexts/GlobalContext";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import PosterCard from "../components/PosterCard";


function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}


const PostersPage = () => {
    const [posters, setPosters] = useState([]);
    const [query, setQuery] = useState("");
    const [filteredPoster, setFilteredPoster] = useState(posters);

    const fetchPoster = () => {
        axios
            .get("http://localhost:3000/posters")
            .then((resp) => {
                setPosters(resp.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        fetchPoster();
    }, []);

    useEffect(() => {
        setFilteredPoster(posters);
    }, [posters]);

    const debouncedSearch = useRef(
        debounce((value) => {
            const url = `http://localhost:3000/posters/search?term=${encodeURIComponent(value)}`;
            axios
                .get(url)
                .then((res) => setFilteredPoster(res.data.data))
                .catch((err) => console.error("Errore:", err));
        }, 500)
    ).current;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (query == "") {
            return setFilteredPoster(posters);
        }

        debouncedSearch(query); // attiva la funzione solo se non viene richiamata di nuovo entro 500ms
    };

    // useEffect(() => {
    //     setFilteredPoster(
    //         posters.filter((poster) => poster.title.toLowerCase().includes(filter.toLowerCase()))
    //     )
    // }, [posters, filter]);


    const empty = (array) => {
        if (array.length == 0) return <p>😭Articolo non trovato😭</p>
    }

    return (
        <>
            <div className="col-12 d-flex flex-column align-items-center justify-content-center text-center p-4 gap-3">
                <h1 className="display-4">Manifesti POP</h1>
                <h5 className="text-muted">
                    I manifesti POP sono opere d'arte che celebrano la cultura popolare;
                    questi manifesti catturano l'essenza della società contemporanea, per
                    comunicare messaggi di critica sociale o semplicemente per celebrare
                    la bellezza della vita quotidiana.
                </h5>

            </div>

            <form action="" className="d-flex justify-content-between px-4" onSubmit={handleSubmit}>
                <div className="d-flex">
                    <input type="text" className="me-2 p-2" style={{ borderRadius: '20px', border: "1px solid black" }} placeholder="Ricerca" value={query}
                        onChange={(e) => setQuery(e.target.value)} />
                    <button type="submit" className="btn btn-primary" style={{ borderRadius: "20px" }}>Cerca</button>
                </div>
                <div>

                </div>
            </form>

            <div className="p-4 d-flex justify-content-center">
                {empty(filteredPoster)}
            </div>

            <div className="col-12">
                <div className="row gy-4 p-3 align-items-stretch">
                    {filteredPoster.map(poster => (
                        <div className="col-lg-3 col-md-6 col-sm-12" key={poster.id}>
                            <PosterCard poster={poster} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
};

export default PostersPage;