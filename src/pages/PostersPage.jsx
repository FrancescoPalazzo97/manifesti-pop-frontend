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
    const [size, setSize] = useState("");

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
        debounce((value, priceValue, sizeValue) => {
            let url = `http://localhost:3000/posters/search?term=${encodeURIComponent(
                value
            )}&minPrice=0&maxPrice=${priceValue}`;
            if (sizeValue) {
                url += `&size=${sizeValue}`;
            }
            axios
                .get(url)
                .then((res) => setFilteredPoster(res.data.data))
                .catch((err) => console.error("Errore:", err));
        }, 500)
    ).current;

    useEffect(() => {
        const term = query.trim();
        const isFiltering = term !== "" || size !== "" || maxPrice !== 200;
        if (isFiltering) {
            debouncedSearch(term, maxPrice, size);
        }

    }, [query, maxPrice, size]);

    return (
        <>
            <div className="col-12 d-flex flex-column align-items-center justify-content-center text-center p-4 gap-3">
                <h1 className="display-4">Manifesti POP</h1>
                <h4 className="text-muted">Lista di tutti i Manifesti.</h4>
            </div>

            <div className="px-4 form-container">
                <div className="form-position">
                    <input
                        type="text"
                        className="me-2 p-2"
                        style={{ borderRadius: "20px", border: "1px solid #d13b3b" }}
                        placeholder="Ricerca"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />

                    <select
                        name="size"
                        id="size"
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                    >
                        <option value="">Tutte le taglie</option>
                        <option value="sm">sm</option>
                        <option value="md">md</option>
                        <option value="lg">lg</option>
                    </select>

                    <div className="d-flex align-items-center price">
                        <label htmlFor="price" className="me-3">
                            max: {maxPrice}€
                        </label>
                        <input
                            type="range"
                            id="price"
                            min={0}
                            max={200}
                            step={1}
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                            className="custom-range"
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
                    {filteredPoster.map((poster) => (
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
