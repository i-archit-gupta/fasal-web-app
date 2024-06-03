
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import ErrorMessage from "./components/common/ErrorMessage";
import Loader from "./components/common/Loader";
import Box from "./components/layout/Box";
import Main from "./components/layout/Main";
import Navbar from "./components/layout/Navbar";
import MovieDetails from "./components/movies/MovieDetails";
import MovieList from "./components/movies/MovieList";
import NumResults from "./components/search/NumResults";
import Search from "./components/search/Search";
import WatchedMovieList from "./components/watched/WatchedMovieList";
import WatchedSummary from "./components/watched/WatchedSummary";
import { useLocalStorageState } from "./hooks/useLocalStorageState";
import { useMovies } from "./hooks/useMovies";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const { movies, isLoading, error } = useMovies(query);

  const [watched, setWatched] = useLocalStorageState([], "watched");

  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <Navbar>
        {!isAuthenticated ? (
          <button onClick={() => loginWithRedirect()}>Log in</button>
        ) : (
          <>
            <button onClick={() => logout({ returnTo: window.location.origin })}>
              Log out
            </button>
            <span>Welcome, {user.name}</span>
          </>
        )}
        <Search
          query={query}
          setQuery={setQuery}
          onCloseMovie={handleCloseMovie}
        />
        <NumResults movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
