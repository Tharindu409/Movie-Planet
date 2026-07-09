import './css/App.css';
import Home from "./page/Home"
import {Routes,Route} from "react-router-dom";
import Faviourites from './page/Favourites'
import Navbar from './components/NavBar';
import { MovieProvider } from './contexts/MovieContext';
import { UserProvider } from './contexts/UserContext';
import { WatchlistProvider } from './contexts/WatchlistContext';
import { CollectionProvider } from './contexts/CollectionContext';
import Login from './UserManagement/Login';
import Register from './UserManagement/Register';
import MovieDetails from './page/MovieDetails';
import LocalMovies from './page/LocalMovies';
import LocalMovieDetails from './page/LocalMovieDetails';
import Watchlist from './page/Watchlist';
import Collections from './page/Collections';
import CollectionDetails from './page/CollectionDetails';
import AdminDashboard from './page/AdminDashboard';

function App() {
  return (
    <UserProvider>
      <WatchlistProvider>
        <CollectionProvider>
          <MovieProvider>
            <Navbar/>
            <main className='main-content'>
              <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/favourite' element={<Faviourites/>}/>
                <Route path='/watchlist' element={<Watchlist/>}/>
                <Route path='/collections' element={<Collections/>}/>
                <Route path='/collections/:id' element={<CollectionDetails/>}/>
                <Route path='/Home' element={<Home/>}/>
                <Route path='/register' element={<Register/>}/>
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/local" element={<LocalMovies/>} />
                <Route path="/local/:id" element={<LocalMovieDetails/>} />
                <Route path='/profile' element={<Home scrollToProfileOnMount={true} />} />
                <Route path='/admin' element={<AdminDashboard/>}/>
              </Routes>
            </main>
          </MovieProvider>
        </CollectionProvider>
      </WatchlistProvider>
    </UserProvider>
  );
}

export default App
