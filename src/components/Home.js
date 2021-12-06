import axios from "axios";
import React from "react";
import { db } from '../firebase-config'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import Button from '@mui/material/Button';
import GridLayout from 'react-grid-layout';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import './Classes.css'

function Home(props) {
    const [books, setBooks] = React.useState([])
    const [title, setTitle] = React.useState("")
    const [author, setAuthor] = React.useState("")
    const [genre, setGenre] = React.useState("")
    const [row, setRow] = React.useState("")
    const [column, setColumn] = React.useState("")
    const [library, setLibrary] = React.useState(null)
    const [layout, setLayout] = React.useState(null)
    const [layoutGrid, setLayoutGrid] = React.useState(null)
    const [rowsLibrary, setRowsLibrary] = React.useState([])
    const [columnsLibrary, setColumnsLibrary] = React.useState([])
    const booksCollectionRef = collection(db, "mybooks")
    const libraryCollectionRef = collection(db, "library")

    const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "Z"]

    // const layout = [
    //     { i: 'a', x: 0, y: 0, w: 1, h: 2, static: true },
    //     { i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
    //     { i: 'c', x: 4, y: 0, w: 1, h: 2 }
    // ];
    // whenever the page reloads (renders), the hook "useEffect" is called
    React.useEffect(() => {
        getBooks()
        getLibraryStructure()
    }, [])

    React.useEffect(() => {
        if (library !== null) {
            createLibrary()
        }
    }, [library])

    React.useEffect(() => {
        console.log("layout: ", layout)
    }, [layout])

    React.useEffect(() => {
        console.log("layoutGrid: ", layoutGrid)
    }, [layoutGrid])

    React.useEffect(() => {
        console.log("library: ", library)
    }, [library])

    React.useEffect(() => {
        console.log("columnsLibrary: ", columnsLibrary)
    }, [columnsLibrary])

    React.useEffect(() => {
        console.log("rowsLibrary: ", rowsLibrary)
    }, [rowsLibrary])

    const createLibrary = () => {
        var structure = []
        var structureGrid = []
        var rows = []
        var cols = []
        if (library.length > 0) {
            for (var c = 0; c < library[0].columns; c++) {
                rows = []
                for (var r = 0; r < library[0].rows; r++) {
                    structure.push({ row: r, column: c, selected: false, key: r.toString() + c.toString() })
                    structureGrid.push({ i: r.toString() + alphabet[c].toString(), x: ((12 - 12 % library[0].columns) / library[0].columns) * c, y: r, w: 2, h: 1, static: true })
                    rows.push(r)
                }
                cols.push(alphabet[c])
            }
        }
        setLayout(structure)
        setLayoutGrid(structureGrid)
        setRowsLibrary(rows)
        setColumnsLibrary(cols)
    }

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

    return (
        <div style={{ width: '100vw' }}>
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
            {/* <div>
                {getLibrary()}
            </div> */}
            <div>
                {
                    (layout === null && columnsLibrary.length > 0) ? "" :
                        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', width: '100%' }}>
                            {
                                columnsLibrary.map((c) => {
                                    return <div className="layout">{c}
                                        <GridLayout style={{ backgroundColor: '#964b00c7', marginLeft: '0.5rem', marginRight: '0.5rem' }} layout={layoutGrid} cols={12} rowHeight={40} width={12 - 12 % library[0].columns}>
                                            {
                                                rowsLibrary.map((r) => {
                                                    return <div style={{ backgroundColor: 'red' }} className="hovered" key={r.toString() + c.toString()}><ArrowUpwardIcon></ArrowUpwardIcon>{r.toString() + c.toString()}</div>
                                                })
                                            }
                                        </GridLayout>
                                    </div>
                                })
                            }
                        </div>
                }
            </div>

            {/* <GridLayout className="layout" cols={12} rowHeight={30} width={1200}>
                <div key="a" data-grid={{ x: 0, y: 0, w: 1, h: 2, static: true }}>a</div>
                <div key="b" data-grid={{ x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 }}>b</div>
                <div key="c" data-grid={{ x: 4, y: 0, w: 1, h: 2 }}>c</div>
            </GridLayout> */}

            {/* <div>
                {
                    (layout === null) ? "" : <div>
                        {layout.map((scaffale) => {
                            return <span>{scaffale.column}</span>
                        })}
                    </div>
                }
            </div> */}



        </div >
    );
}

export default Home;
