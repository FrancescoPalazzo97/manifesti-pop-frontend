import { useGlobalContext } from "../contexts/GlobalContext";

const HomePage = () => {
    const [posters, setPosters] = useState([]);
    const [filteredPoster, setFilteredPoster] = useState(posters);
    const { filter, setFilter } = useGlobalContext();

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
        setFilteredPoster(
            posters.filter((poster) => poster.title.toLowerCase().includes(filter.toLowerCase()))
        )
    }, [posters, filter]);


    const empty = (array) => {
        if (array.length == 0) return <p className="fs-2 fw-bold">😭Articolo non trovato😭</p>
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
}