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
    // const [filteredPoster, setFilteredPoster] = useState([]);
    // const [maxPrice, setMaxPrice] = useState(200);
    // const [size, setSize] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();


    const query = searchParams.get("term");
    const size = searchParams.get("size") || "";
    const maxPrice = parseInt(searchParams.get("maxPrice") || "200");
    const orderBy = searchParams.get("orderBy") || "";
    const orderDirection = searchParams.get("orderDirection") || "desc";


    const [tempMaxPrice, setTempMaxPrice] = useState(maxPrice);

    const debouncedFilterChange = useRef(
        debounce((newQuery, newSize, newMaxPrice, newOrderBy, newOrderDirection) => {
            const params = {};
            if (newQuery) params.term = newQuery;
            if (newSize) params.size = newSize;
            if (newMaxPrice !== 200) params.maxPrice = newMaxPrice;
            if (newOrderBy) params.orderBy = newOrderBy;
            if (newOrderDirection) params.orderDirection = newOrderDirection;
            setSearchParams(params);
        }, 500)
    ).current;



    useEffect(() => {
        debouncedFilterChange(query, size, tempMaxPrice, orderBy, orderDirection);
    }, [query, size, tempMaxPrice, orderBy, orderDirection]);

    const handleFiltersChange = (newSize, newMaxPrice, newOrderBy, newOrderDirection) => {
        const params = {};
        if (query) params.term = query;
        if (newSize) params.size = newSize;
        if (newMaxPrice !== 200) params.maxPrice = newMaxPrice;
        if (newOrderBy) params.orderBy = newOrderBy;
        if (newOrderDirection) params.orderDirection = newOrderDirection;
        setSearchParams(params);
    };



    useEffect(() => {
        const url = `http://localhost:3000/posters/search?term=${encodeURIComponent(query)}&minPrice=0&maxPrice=${maxPrice}${size ? `&size=${size}` : ''}${orderBy ? `&orderBy=${orderBy}` : ''}${orderDirection ? `&orderDirection=${orderDirection}` : ''}`;
        axios.get(url)
            .then(res => setPosters(res.data.data || res.data))
            .catch(err => console.error(err));
    }, [query, maxPrice, size, orderBy, orderDirection]);


    return (
        <>
            {/* <div className="col-12 d-flex flex-column align-items-center justify-content-center text-center p-4 gap-3">
                <h1 className="display-4">Manifesti POP</h1>
                <h4 className="text-muted">Lista di tutti i Manifesti.</h4>
            </div> */}

            <div className="form-container">
                <div className="row row-flex">
                    <div className="col-12">

                        <div className="form-position">


                            <select
                                name="size"
                                id="size"
                                value={size}
                                onChange={(e) =>
                                    handleFiltersChange(e.target.value, tempMaxPrice, orderBy, orderDirection)
                                }
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

                            <div>
                                <select
                                    name="orderBy"
                                    value={orderBy}
                                    onChange={(e) =>
                                        handleFiltersChange(size, tempMaxPrice, e.target.value, orderDirection)
                                    }
                                >
                                    <option value="">Nessun Ordinamento</option>
                                    <option value="title">Titolo</option>
                                    <option value="price">Prezzo</option>
                                    <option value="creation_date">Data</option>
                                </select>

                                <select
                                    name="orderDirection"
                                    value={orderDirection}
                                    onChange={(e) =>
                                        handleFiltersChange(size, tempMaxPrice, orderBy, e.target.value)
                                    }
                                >
                                    <option value="desc">Discendente</option>
                                    <option value="asc">Ascendente</option>
                                </select>

                            </div>

                        </div>

                    </div>
                    <div className="col-12 pt-50">
                        <div className="container p-responsive">
                            <h2 className="pt-2">Risultati per: "{query}"</h2>
                            {posters.length === 0 ? (
                                <p>😭 Nessun manifesto trovato 😭</p>
                            ) : (
                                <div className="row py-4">
                                    {posters.map((poster) => (
                                        <div key={poster.id} className="col-sm-12 col-md-12 col-lg-6">
                                            <PosterCard poster={poster} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>


            {/* <div className="col-12">
                <div className="row gy-4 p-3 align-items-stretch">
                    {filteredPoster.map((poster) => (
                        <div className="col-lg-3 col-md-6 col-sm-12" key={poster.id}>
                            <PosterCard poster={poster} />
                        </div>
                    ))}
                </div>
            </div> */}



        </>
    );
};

export default PostersPage;
