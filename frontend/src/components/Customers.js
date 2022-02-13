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
import Grow from '@mui/material/Grow';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import MenuIcon from '@material-ui/icons/Menu';
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

function Customers(props) {
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
        <div>
            <h1 style={{ fontFamily: 'times', marginLeft: '1rem', marginRight: 'auto' }}>Gestione clienti</h1>
        </div >
    );
}

export default Customers;
