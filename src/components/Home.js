import axios from "axios";
import React from "react";
import { db } from '../firebase-config'
import { collection, getDocs, addDoc } from 'firebase/firestore'
import Button from '@mui/material/Button';

let library = require('../models/library.json')

function Home(props) {
    const [books, setBooks] = React.useState([])
    const [title, setTitle] = React.useState("")
    const [author, setAuthor] = React.useState("")
    const [genre, setGenre] = React.useState("")
    const [row, setRow] = React.useState("")
    const [column, setColumn] = React.useState("")
    const booksCollectionRef = collection(db, "mybooks")
    // GET
    const getBooks = async () => {
        const data = await getDocs(booksCollectionRef) //returns all the books of the collection
        console.log("Books: ", data)
        setBooks(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    };
    // whenever the page reloads (renders), the hook "useEffect" is called
    React.useEffect(() => {
        getBooks()
        console.log("library", library)
    }, [])

    // POST
    let addBook = () => {
        addDoc(booksCollectionRef, { title: title, author: author, genre: genre, row: row, column: column })
        getBooks()
    }
    return (
        <div>
            <div style={{ marginBottom: '4rem' }}>
                <h3>Insert new book</h3>
                <input placeholder="title" onChange={(event) => { setTitle(event.target.value) }} />
                <input placeholder="autore" onChange={(event) => { setAuthor(event.target.value) }} />
                <input placeholder="genere" onChange={(event) => { setGenre(event.target.value) }} />
                <input placeholder="mobile" onChange={(event) => { setColumn(event.target.value) }} />
                <input placeholder="scaffale" onChange={(event) => { setRow(event.target.value) }} />
                <Button onClick={addBook}>Aggiungi libro</Button>
            </div>
            {
                books.map((book) => {
                    return <li>{book.title}</li>
                })
            }
        </div >
    );
}

export default Home;
