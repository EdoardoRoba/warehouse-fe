import axios from "axios";
import * as React from "react";
import { db } from '../firebase-config'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Grow from '@mui/material/Grow';
import FormControlLabel from '@mui/material/FormControlLabel';
import './Classes.css'

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function Home(props) {
    const [books, setBooks] = React.useState([])
    const [title, setTitle] = React.useState("")
    const [author, setAuthor] = React.useState("")
    const [genre, setGenre] = React.useState("")
    const [row, setRow] = React.useState("")
    const [column, setColumn] = React.useState("")
    const [library, setLibrary] = React.useState(null)
    const [layout, setLayout] = React.useState(null)
    const [rowsLibrary, setRowsLibrary] = React.useState([])
    const [columnsLibrary, setColumnsLibrary] = React.useState([])
    const [open, setOpen] = React.useState(false);
    const [booksInShelf, setBooksInShelf] = React.useState([])
    const [shelfRowSelected, setShelfRowSelected] = React.useState("")
    const [shelfColumnSelected, setShelfColumnSelected] = React.useState("")
    const [addBookFlag, setAddBookFlag] = React.useState(false);
    const [updateBookFlag, setUpdateBookFlag] = React.useState(false);
    const [deleteBookFlag, setDeleteBookFlag] = React.useState(false);
    // const handleOpen = () => setOpen(true);

    const booksCollectionRef = collection(db, "mybooks")
    const libraryCollectionRef = collection(db, "library")

    const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "Z"]

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

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
        console.log("books: ", books)
    }, [books])

    React.useEffect(() => {
        console.log("booksInShelf: ", booksInShelf)
    }, [booksInShelf])

    React.useEffect(() => {
        console.log("library: ", library)
    }, [library])

    React.useEffect(() => {
        console.log("columnsLibrary: ", columnsLibrary)
    }, [columnsLibrary])

    React.useEffect(() => {
        console.log("rowsLibrary: ", rowsLibrary)
    }, [rowsLibrary])

    const handleChangeAddBook = () => {
        setAddBookFlag((prev) => !prev);
        setUpdateBookFlag(false);
        setDeleteBookFlag(false);
    };

    const handleChangeUpdateBook = () => {
        setUpdateBookFlag((prev) => !prev);
        setAddBookFlag(false);
        setDeleteBookFlag(false);
    };

    const handleChangeDeleteBook = () => {
        setDeleteBookFlag((prev) => !prev);
        setAddBookFlag(false);
        setUpdateBookFlag(false);
    };

    const createLibrary = () => {
        var structure = []
        var structureGrid = []
        var rows = []
        var cols = []
        if (library.length > 0) {
            for (var c = 0; c < library[0].columns; c++) {
                rows = []
                structureGrid[c] = []
                structure[c] = []
                for (var r = 0; r < library[0].rows; r++) {
                    structure[c].push({ row: r, column: c, selected: false, key: r.toString() + alphabet[c].toString(), color: '#964b00c7' })
                    // ((12 - 12 % library[0].columns) / library[0].columns) * c
                    rows.push(r)
                }
                cols.push(c)
            }
        }
        setLayout(structure)
        setRowsLibrary(rows)
        setColumnsLibrary(cols)
    }

    const handleClose = (l) => {
        setOpen(false)
        setBooksInShelf([])
        l.map((col) => {
            col.map((row) => {
                row.color = "#964b00c7"
            })
        })
        setLayout(l)
    };

    const showShelf = (row, column) => {
        // I take the books in this shelf
        const bInShelf = books.filter(book =>
            book.row == row.toString() && book.column == alphabet[column].toString()
        )
        layout[column][row].color = "green"
        setLayout(layout)
        setBooksInShelf(bInShelf)
        setShelfRowSelected(row.toString())
        setShelfColumnSelected(alphabet[column])
        setOpen(true)
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
        addDoc(booksCollectionRef, { title: title, author: author, genre: genre, row: (parseInt(row) - 1).toString(), column: column })
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
            <h1 style={{ fontFamily: 'times' }}>La mia libreria</h1>

            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                <Button variant="outlined" style={{ color: 'white', backgroundColor: 'green', marginRight: '1rem' }} onClick={handleChangeAddBook}>
                    Aggiungi libro
                </Button>
                <Button style={{ color: 'white', backgroundColor: '#ffae1b', marginLeft: '1rem', marginRight: '1rem' }} onClick={handleChangeUpdateBook}>
                    Aggiorna libro
                </Button>
                <Button style={{ color: 'white', backgroundColor: 'red', marginLeft: '1rem' }} onClick={handleChangeDeleteBook}>
                    Elimina libro
                </Button>
            </div>
            {
                (!addBookFlag ? "" : <Box sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                    <Grow
                        in={addBookFlag}
                        style={{ transformOrigin: '0 0 0' }}
                        {...(addBookFlag ? { timeout: 1000 } : {})}
                    >
                        <div style={{ marginTop: '2rem' }}>
                            <input placeholder="titolo" onChange={(event) => { setTitle(event.target.value) }} />
                            <input placeholder="autore" onChange={(event) => { setAuthor(event.target.value) }} />
                            <input placeholder="genere" onChange={(event) => { setGenre(event.target.value) }} />
                            <input placeholder="mobile" onChange={(event) => { setColumn(event.target.value) }} />
                            <input placeholder="scaffale" onChange={(event) => { setRow(event.target.value) }} />
                            <Button variant="outlined" style={{ color: 'white', backgroundColor: 'green' }} onClick={addBook}>Conferma</Button>
                        </div>
                    </Grow>
                </Box>)
            }
            {
                (!updateBookFlag ? "" : <Box sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                    <Grow
                        in={updateBookFlag}
                        style={{ transformOrigin: '0 0 0' }}
                        {...(updateBookFlag ? { timeout: 1000 } : {})}
                    >
                        <div style={{ marginTop: '2rem' }}>
                            <input placeholder="titolo" onChange={(event) => { setTitle(event.target.value) }} />
                            <input placeholder="autore" onChange={(event) => { setAuthor(event.target.value) }} />
                            <input placeholder="genere" onChange={(event) => { setGenre(event.target.value) }} />
                            <input placeholder="mobile" onChange={(event) => { setColumn(event.target.value) }} />
                            <input placeholder="scaffale" onChange={(event) => { setRow(event.target.value) }} />
                            <Button style={{ color: 'white', backgroundColor: '#ffae1b', marginLeft: '1rem' }} onClick={() => { console.log("to update") }}>Conferma</Button>
                        </div>
                    </Grow>
                </Box>)
            }
            {
                (!deleteBookFlag ? "" : <Box sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                    <Grow
                        in={deleteBookFlag}
                        style={{ transformOrigin: '0 0 0' }}
                        {...(deleteBookFlag ? { timeout: 1000 } : {})}
                    >
                        <div style={{ marginTop: '2rem' }}>
                            <input placeholder="titolo" onChange={(event) => { setTitle(event.target.value) }} />
                            <Button style={{ color: 'white', backgroundColor: 'red', marginLeft: '1rem' }} onClick={() => { console.log("to update") }}>Conferma</Button>
                        </div>
                    </Grow>
                </Box>)
            }


            {/* {
                books.map((book) => {
                    return <div>
                        <li>{book.title}</li>
                        <Button onClick={() => { updateBook(book.id, book, "updated") }}>Update</Button>
                        <Button onClick={() => { deleteBook(book.id, book, "updated") }}>Delete</Button>
                    </div>
                })
            } */}

            {/* LIBRARY */}
            <h2 style={{ marginTop: '5rem', fontFamily: 'times' }}>Scaffali:</h2>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                {
                    columnsLibrary.map((c) => {
                        return <div style={{ marginLeft: '0.5rem', marginRight: '0.5rem' }}><span>{alphabet[c]}</span>
                            <Grid container>
                                {
                                    rowsLibrary.map((r) => {
                                        return <Grid item xs={12}>
                                            <Item onClick={() => { showShelf(r, c) }} className="hovered" style={{ backgroundColor: layout[c][r].color }}>{(r + 1).toString()}</Item>
                                        </Grid>
                                    })
                                }
                            </Grid>
                        </div>
                    })
                }
            </div>

            {/* Modal to show books in the selected shelf */}
            <Modal
                open={open}
                onClose={() => { handleClose(layout) }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography style={{ marginBottom: '2rem' }} id="modal-modal-title" variant="h6" component="h2">
                        Books in the selected shelf: {shelfColumnSelected + " - " + (parseInt(shelfRowSelected) + 1).toString()}
                    </Typography>
                    {
                        (booksInShelf.length === 0) ? <span style={{ color: 'grey' }}>No books present in this shelf.</span> :
                            booksInShelf.map((bis) => {
                                return <li style={{ marginBottom: '0.5rem' }}>{bis.title} - {bis.author}</li>
                            })
                    }
                </Box>
            </Modal>

        </div >
    );
}

export default Home;
