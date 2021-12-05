import axios from "axios";
import React from "react";
import { db } from '../firebase-config'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import Button from '@mui/material/Button';

function Home(props) {
    const [books, setBooks] = React.useState([])
    const [title, setTitle] = React.useState("")
    const [author, setAuthor] = React.useState("")
    const [genre, setGenre] = React.useState("")
    const [row, setRow] = React.useState("")
    const [column, setColumn] = React.useState("")
    const [library, setLibrary] = React.useState({})
    const booksCollectionRef = collection(db, "mybooks")
    const libraryCollectionRef = collection(db, "library")
    // GET
    const getBooks = async () => {
        const data = await getDocs(booksCollectionRef) //returns all the books of the collection
        console.log("Books: ", data)
        setBooks(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    };
    const getLibraryStructure = async () => {
        const data = await getDocs(libraryCollectionRef) //returns all the books of the collection
        console.log("Library: ", data)
        setLibrary(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    };
    // whenever the page reloads (renders), the hook "useEffect" is called
    React.useEffect(() => {
        getBooks()
        getLibraryStructure()
    }, [])

    // POST
    let addBook = () => {
        addDoc(booksCollectionRef, { title: title, author: author, genre: genre, row: row, column: column })
        getBooks()
    }

    // PUT
    let updateBook = (id, book, newTitle) => {
        const bookDoc = doc(db, "mybooks", id)
        // YOU CAN ALSO UPDATE ONLY THE FIELD YOU WANT
        const newField = { title: newTitle }
        updateDoc(bookDoc, newField)
        getBooks()
    }

    // DELETE
    let deleteBook = (id) => {
        const userDoc = doc(db, "mybooks", id);
        deleteDoc(userDoc);
        getBooks()
    }

    const getLibrary = () => {
        var structure = []
        if (library.length > 0) {
            for (var c = 0; c < library[0].columns; c++) {
                for (var r = 0; r < library[0].rows; r++) {
                    structure.push(<span>row {r + 1}</span>)
                }
                structure.push(<span>column {c + 1}</span>)
            }
        }
        return <div>
            <div>{structure}</div>
        </div>
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
                    return <div>
                        <li>{book.title}</li>
                        <Button onClick={() => { updateBook(book.id, book, "updated") }}>Update</Button>
                        <Button onClick={() => { deleteBook(book.id, book, "updated") }}>Delete</Button>
                    </div>
                })
            }

            {/* LIBRARY */}
            <div>
                {getLibrary()}
            </div>

        </div >
    );
}

export default Home;
