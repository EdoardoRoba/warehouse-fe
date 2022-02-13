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
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import IconButton from '@mui/material/IconButton';
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
    const [label, setLabel] = React.useState("")
    const [quantity, setQuantity] = React.useState("")
    const [lowerBound, setLowerBound] = React.useState("")
    const [price, setPrice] = React.useState("")
    const [row, setRow] = React.useState("")
    const [column, setColumn] = React.useState("")
    const [rowLayout, setRowLayout] = React.useState("")
    const [columnLayout, setColumnLayout] = React.useState("")
    const [library, setLibrary] = React.useState(null)
    const [layout, setLayout] = React.useState(null)
    const [rowsLibrary, setRowsLibrary] = React.useState([])
    const [columnsLibrary, setColumnsLibrary] = React.useState([])
    const [open, setOpen] = React.useState(false);
    const [openLibraryUpdate, setOpenLibraryUpdate] = React.useState(false);
    const [booksInShelf, setBooksInShelf] = React.useState([])
    const [shelfRowSelected, setShelfRowSelected] = React.useState("")
    const [shelfColumnSelected, setShelfColumnSelected] = React.useState("")
    const [addBookFlag, setAddBookFlag] = React.useState(false);
    const [getBookFlag, setGetBookFlag] = React.useState(false);
    const [updateBookFlag, setUpdateBookFlag] = React.useState(false);
    const [deleteBookFlag, setDeleteBookFlag] = React.useState(false);
    const [confermaAdd, setConfermaAdd] = React.useState(false);
    const [confermaUpdate, setConfermaUpdate] = React.useState(false);
    const [confermaDelete, setConfermaDelete] = React.useState(false);
    const [notFound, setNotFound] = React.useState("");
    // const handleOpen = () => setOpen(true);

    const structureId = "6205a1c27f6cda42c2064a0f"
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
        const timer = setTimeout(() => {
            setConfermaAdd(false)
        }, 5000);
        return () => clearTimeout(timer);
    }, [confermaAdd]);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setConfermaUpdate(false)
        }, 5000);
        return () => clearTimeout(timer);
    }, [confermaUpdate]);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setConfermaDelete(false)
        }, 5000);
        return () => clearTimeout(timer);
    }, [confermaDelete]);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setNotFound("")
        }, 5000);
        return () => clearTimeout(timer);
    }, [notFound]);

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
        setGetBookFlag(false);
    };

    const handleChangeGetBook = () => {
        setGetBookFlag((prev) => !prev);
        setUpdateBookFlag(false);
        setDeleteBookFlag(false);
        setAddBookFlag(false);
    };

    const handleChangeUpdateBook = () => {
        setUpdateBookFlag((prev) => !prev);
        setAddBookFlag(false);
        setDeleteBookFlag(false);
        setGetBookFlag(false);
    };

    const handleChangeDeleteBook = () => {
        setDeleteBookFlag((prev) => !prev);
        setAddBookFlag(false);
        setUpdateBookFlag(false);
        setGetBookFlag(false);
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

    const handleCloseLibraryUpdate = (l) => {
        setOpenLibraryUpdate(false)
        getBooks()
        getLibraryStructure()
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
        axios.get('http://localhost:8050/tool')
            .then(res => {
                console.log("Tools: ", res.data)
                setBooks(res.data)
            })
    };
    const getLibraryStructure = async () => {
        axios.get('http://localhost:8050/structure')
            .then(res => {
                console.log("Library: ", res.data)
                setLibrary(res.data)
            })
    };
    const getBook = async (label) => {
        let count = 0
        books.map((b) => {
            if (b.label.toUpperCase() === label.toUpperCase()) {
                count = count + 1
                layout[alphabet.indexOf(b.column)][parseInt(b.row)].color = "green"
                getBooks()
                const timer = setTimeout(() => {
                    layout[alphabet.indexOf(b.column)][parseInt(b.row)].color = "#964b00c7"
                    getBooks()
                }, 7000);
                return () => clearTimeout(timer);
            }
        })
        if (count === 0) {
            setNotFound(label)
        }
    };

    // POST
    let addBook = () => {
        axios.post('http://localhost:8050/tool', { label: label, quantity: quantity, lowerBound: lowerBound, price: price, row: (parseInt(row) - 1).toString(), column: column })
            .then(response => {
                setConfermaAdd(true)
                getBooks()
            });
    }

    // PUT
    let updateBook = (label, q, r, c) => {
        var bookDoc = ""
        var bookId = ""
        const newField = { label: label, row: r - 1, column: c, quantity: q }
        books.map((b) => {
            if (b.label.toUpperCase() === label.toUpperCase()) {
                bookId = b._id
            }
        })
        if (bookId !== "") {
            axios.put("http://localhost:8050/tool/" + bookId, newField).then(response => {
                console.log("Fatto!", response)
                setConfermaUpdate(true)
                getBooks()
            }).catch((error) => { console.log("error: ", error) });
        } else {
            setConfermaUpdate(false)
            setNotFound(label)
        }
        getBooks()
    }

    let updateLibraryLayout = (r, c) => {
        const newField = { rows: parseInt(r), columns: parseInt(c) }
        axios.put("http://localhost:8050/structure/" + structureId, newField).then(response => {
            getBooks()
            getLibraryStructure()
            setOpenLibraryUpdate(false)
        }).catch((error) => { console.log("error: ", error) });

    }

    // DELETE
    let deleteBook = (label) => {
        var userDoc = ""
        var bookId = ""
        books.map((b) => {
            if (b.label.toUpperCase() === label.toUpperCase()) {
                bookId = b._id
            }
        })
        if (bookId !== "") {
            axios.delete('http://localhost:8050/tool/' + bookId)
                .then(() => {
                    setConfermaDelete(true)
                    getBooks()
                });
        } else {
            setConfermaDelete(false)
            setNotFound(label)
        }
        getBooks()
    }

    return (
        <div style={{ width: '100vw' }}>
            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                <h1 style={{ fontFamily: 'times', marginLeft: '1rem', marginRight: 'auto' }}>La mia libreria</h1>
                <Tooltip style={{ marginRight: '1rem' }} label="Aggiorna struttura libreria">
                    <IconButton onClick={() => { setOpenLibraryUpdate(true) }}>
                        <SystemUpdateAltIcon />
                    </IconButton>
                </Tooltip>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '3rem' }}>
                <Button variant="outlined" style={{ color: 'white', backgroundColor: 'green', marginRight: '1rem' }} onClick={handleChangeAddBook}>
                    Aggiungi attrezzo
                </Button>
                <Button variant="outlined" style={{ color: 'white', backgroundColor: 'blue', marginRight: '1rem' }} onClick={handleChangeGetBook}>
                    Trova attrezzo
                </Button>
                <Button style={{ color: 'white', backgroundColor: '#ffae1b', marginLeft: '1rem', marginRight: '1rem' }} onClick={handleChangeUpdateBook}>
                    Aggiorna attrezzo
                </Button>
                <Button style={{ color: 'white', backgroundColor: 'red', marginLeft: '1rem' }} onClick={handleChangeDeleteBook}>
                    Elimina attrezzo
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
                            <input placeholder="attrezzo" onChange={(event) => { setLabel(event.target.value) }} />
                            <input placeholder="quantità" onChange={(event) => { setQuantity(event.target.value) }} />
                            <input placeholder="quantità minima" onChange={(event) => { setLowerBound(event.target.value) }} />
                            <input placeholder="prezzo/pz" onChange={(event) => { setPrice(event.target.value) }} />
                            <input placeholder="scaffale" onChange={(event) => { setColumn(event.target.value.toUpperCase()) }} />
                            <input placeholder="ripiano" onChange={(event) => { setRow(event.target.value) }} />
                            <Button variant="outlined" style={{ color: 'white', backgroundColor: 'green' }} onClick={addBook}>Conferma</Button>
                        </div>
                    </Grow>
                </Box>)
            }
            {
                (!getBookFlag ? "" : <Box sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                    <Grow
                        in={getBookFlag}
                        style={{ transformOrigin: '0 0 0' }}
                        {...(getBookFlag ? { timeout: 1000 } : {})}
                    >
                        <div style={{ marginTop: '2rem' }}>
                            <input placeholder="attrezzo" onChange={(event) => { setLabel(event.target.value) }} />
                            <Button variant="outlined" style={{ color: 'white', backgroundColor: 'green' }} onClick={() => { getBook(label) }}>Conferma</Button>
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
                            <input placeholder="attrezzo" onChange={(event) => { setLabel(event.target.value) }} />
                            <input placeholder="quantità" onChange={(event) => { setQuantity(event.target.value) }} />
                            <input placeholder="scaffale" onChange={(event) => { setColumn(event.target.value) }} />
                            <input placeholder="ripiano" onChange={(event) => { setRow(event.target.value) }} />
                            <Button style={{ color: 'white', backgroundColor: '#ffae1b', marginLeft: '1rem' }} onClick={() => { updateBook(label, quantity, row, column) }}>Conferma</Button>
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
                            <input placeholder="attrezzo" onChange={(event) => { setLabel(event.target.value) }} />
                            <Button style={{ color: 'white', backgroundColor: 'red', marginLeft: '1rem' }} onClick={() => { deleteBook(label) }}>Conferma</Button>
                        </div>
                    </Grow>
                </Box>)
            }

            <div>
                {
                    (!confermaAdd) ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="success">Attrezzo aggiunto correttamente!</Alert>
                }
                {
                    (!confermaUpdate) ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="success">Attrezzo aggiornato correttamente!</Alert>
                }
                {
                    (!confermaDelete) ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="success">Attrezzo eliminato correttamente!</Alert>
                }
                {
                    (notFound === "") ? "" : <Alert style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }} severity="error">Attrezzo {notFound} non trovato! Controlla che il attrezzo sia scritto correttamente.</Alert>
                }
            </div>

            {/* LIBRARY */}
            <h2 style={{ marginTop: '5rem', fontFamily: 'times', marginLeft: '1rem' }}>Scaffali:</h2>
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
                aria-labelledby="modal-modal-label"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography style={{ marginBottom: '2rem' }} id="modal-modal-label" variant="h6" component="h2">
                        Libri nel ripiano: {shelfColumnSelected + " - " + (parseInt(shelfRowSelected) + 1).toString()}
                    </Typography>
                    {
                        (booksInShelf.length === 0) ? <span style={{ color: 'grey' }}>Nello ripiano selezionato non sono presenti attrezzi.</span> :
                            booksInShelf.map((bis) => {
                                return <li style={{ marginBottom: '0.5rem' }}>{bis.label} - {bis.quantity}</li>
                            })
                    }
                </Box>
            </Modal>

            {/* Modal to update library structure */}
            <Modal
                open={openLibraryUpdate}
                onClose={() => { handleCloseLibraryUpdate(layout) }}
                aria-labelledby="modal-modal-label"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography style={{ marginBottom: '2rem' }} id="modal-modal-label" variant="h6" component="h2">
                        Seleziona la nuova struttura della tua libreria:
                    </Typography>
                    <input placeholder="numero di scaffali" onChange={(event) => { setColumnLayout(event.target.value) }} />
                    <input placeholder="numero di ripiani" onChange={(event) => { setRowLayout(event.target.value) }} />
                    <Button style={{ color: 'white', backgroundColor: '#ffae1b', marginLeft: '1rem' }} onClick={() => { updateLibraryLayout(rowLayout, columnLayout) }}>Conferma</Button>
                </Box>
            </Modal>

        </div >
    );
}

export default Home;
