import React from 'react'

const NotFound = () => {
    return (
        <>
            <div className="text-center py-5">
                <h1>Qua non ci sono Manifesti 🖼️</h1>
                <p>La pagina che cerchi non esiste! 🫣</p>
                <h2>Torna alla <a
                    className='text-danger'
                    href="/"><strong>Home Page</strong></a>.</h2>
            </div>
        </>
    )
}

export default NotFound
