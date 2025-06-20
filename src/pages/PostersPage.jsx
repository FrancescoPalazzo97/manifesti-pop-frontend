import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
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
    // const [query, setQuery] = useState("");
    const [filteredPoster, setFilteredPoster] = useState([]);
    // const [maxPrice, setMaxPrice] = useState(200);
    // const [size, setSize] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();


    const query = searchParams.get("term");
    const size = searchParams.get("size") || "";
    const maxPrice = parseInt(searchParams.get("maxPrice") || "200");

    const [tempMaxPrice, setTempMaxPrice] = useState(maxPrice);

    const debouncedFilterChange = useRef(
        debounce((newSize, newMaxPrice) => {
            const params = {};
            if (query) params.term = query;
            if (newSize) params.size = newSize;
            if (newMaxPrice !== 200) params.maxPrice = newMaxPrice;
            setSearchParams(params);
        }, 500)
    ).current;



    useEffect(() => {
        debouncedFilterChange(size, tempMaxPrice);
    }, [tempMaxPrice]);

    const handleFiltersChange = (newSize, newMaxPrice) => {
        const params = {};
        if (query) params.term = query;
        if (newSize) params.size = newSize;
        if (newMaxPrice !== 200) params.maxPrice = newMaxPrice;
        setSearchParams(params);
    };


    useEffect(() => {
        const url = `http://localhost:3000/posters/search?term=${encodeURIComponent(query)}&minPrice=0&maxPrice=${maxPrice}${size ? `&size=${size}` : ''}`;
        axios.get(url)
            .then(res => setPosters(res.data.data || res.data))
            .catch(err => console.error(err));
    }, [query, maxPrice, size]);

    return (
        <>
            <div className="col-12 d-flex flex-column align-items-center justify-content-center text-center p-4 gap-3">
                <h1 className="display-4">Manifesti POP</h1>
                <h4 className="text-muted">Lista di tutti i Manifesti.</h4>
            </div>

            <div className="px-4 form-container">
                <div className="form-position">


                    <select
                        name="size"
                        id="size"
                        value={size}
                        onChange={(e) => handleFiltersChange(e.target.value, maxPrice)}
                    >
                        <option value="">Tutte le taglie</option>
                        <option value="sm">sm</option>
                        <option value="md">md</option>
                        <option value="lg">lg</option>
                    </select>

                    <div className="d-flex align-items-center price">
                        <label htmlFor="price" className="me-3">
                            max: {tempMaxPrice}€
                        </label>
                        <input
                            type="range"
                            min={0}
                            max={200}
                            step={1}
                            value={tempMaxPrice}
                            onChange={(e) => setTempMaxPrice(parseInt(e.target.value))}
                        />
                    </div>
                </div>
            </div>

            <div className="col-12">
                <div className="row gy-4 p-3 align-items-stretch">
                    {filteredPoster.map((poster) => (
                        <div className="col-lg-3 col-md-6 col-sm-12" key={poster.id}>
                            <PosterCard poster={poster} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="container">
                <h2>Risultati per: "{query}"</h2>
                {posters.length === 0 ? (
                    <p>😭 Nessun manifesto trovato 😭</p>
                ) : (
                    <div className="row">
                        {posters.map((poster) => (
                            <div key={poster.id} className="col-md-4">
                                <PosterCard poster={poster} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </>
    );
};

export default PostersPage;
