import React from 'react';
import axios from 'axios';

import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';

export class MainView extends React.Component {

    constructor() {
        super();
        this.state = {
            movies: [],
            selectedMovie: null
        }
    }

    componentDidMount() {
        let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjFkMmRhZjQ3ZWNkZTU1NmFhMmIyYWEiLCJVc2VybmFtZSI6ImpvbmRvZTEiLCJQYXNzd29yZCI6IiQyYiQxMCQ5ZkVOc1lzTmg4b0FFcVZSN2xXMDBldm9vLnplUjVEUjk1aDF5MUpuVkhpbHdHamJSNzZ4UyIsIkVtYWlsIjoibmV3am9uZG9lQGVtYWlsLmNvbSIsIkJpcnRoZGF5IjoiMjAxMi0xMS0xMVQwMDowMDowMC4wMDBaIiwiRmF2b3JpdGVNb3ZpZXMiOltdLCJfX3YiOjAsImlhdCI6MTY0NjA3OTQxMywiZXhwIjoxNjQ2Njg0MjEzLCJzdWIiOiJqb25kb2UxIn0.Eoig4YUc4VpSh-N7HDabzVgHnMccvmgtZ2yIsIRC4yc";
        axios.get('https://mclaughlinflixdb.herokuapp.com/movies', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then(response => {
                this.setState({
                    movies: response.data
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    setSelectedMovie(newSelectedMovie) {
        this.setState({
            selectedMovie: newSelectedMovie
        });
    }

    render() {
        const { movies, selectedMovie } = this.state;

        if (movies.length === 0) return <div className="main-view" />;

        return (
            <div className="main-view">
                {selectedMovie
                    ? <MovieView movie={selectedMovie} onBackClick={newSelectedMovie => { this.setSelectedMovie(newSelectedMovie); }} />
                    : movies.map(movie => (
                        <MovieCard key={movie._id} movie={movie} onMovieClick={(movie) => { this.setSelectedMovie(movie) }} />
                    ))
                }
            </div>
        );
    }
}

export default MainView;