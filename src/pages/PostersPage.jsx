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
    const [filteredPoster, setFilteredPoster] = useState([]);
    const [maxPrice, setMaxPrice] = useState(200);

    const fetchPoster = () => {
        axios
            .get("http://localhost:3000/posters")
            .then((resp) => {
                setPosters(resp.data);
                setFilteredPoster(resp.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        fetchPoster();
    }, []);

    const debouncedSearch = useRef(
        debounce((value, priceValue) => {
            const url = `http://localhost:3000/posters/search?term=${encodeURIComponent(value)}&minPrice=0&maxPrice=${priceValue}`;
            axios
                .get(url)
                .then((res) => setFilteredPoster(res.data.data))
                .catch((err) => console.error("Errore:", err));
        }, 500)
    ).current;

    useEffect(() => {
        const term = query.trim(); // oppure "all" se il backend lo richiede
        debouncedSearch(term, maxPrice);
    }, [query, maxPrice]);

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

            <div className="px-4">
                <div className="d-flex justify-content-between mb-3">
                    <input
                        type="text"
                        className="me-2 p-2"
                        style={{ borderRadius: '20px', border: "1px solid black" }}
                        placeholder="Ricerca"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />

                    <div className="d-flex align-items-center">
                        <label htmlFor="price" className="me-3">Prezzo massimo: {maxPrice}€</label>
                        <input
                            type="range"
                            id="price"
                            min={0}
                            max={200}
                            step={1}
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                        />

                    </div>
                </div>
            </div>

            {filteredPoster.length === 0 && (
                <div className="px-4 d-flex justify-content-center">
                    <p>😭 Articolo non trovato 😭</p>
                </div>
            )}

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
    );
};

export default PostersPage;
