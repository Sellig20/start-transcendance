import { useParams } from 'react-router-dom'
import backend from '../../axios/backend'
import { useEffect } from 'react'
 
const Home = () => {

    useEffect(() => {
        console.log("Je fonctionne ?")
        backend.get('/users/me').then((response) => {

            console.log(response);
        }, (error) => {
            console.log(error)
        })
    })

    return (
        <div>
            <h1>HOME BITCHZ</h1>
        </div>
    )
}

export default Home