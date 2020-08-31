import React, { useState, useEffect, useContext } from "react";
import { lighten, makeStyles, useTheme } from "@material-ui/core/styles";
import { UserContext } from "./UserContext";
import { fade } from "@material-ui/core/styles/colorManipulator";
import PropTypes from "prop-types";
import clsx from "clsx";
import EditIcon from "@material-ui/icons/Edit";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Redirect } from "react-router-dom";
import Cookies from "js-cookie";
import TextField from "@material-ui/core/TextField";
import AddBoxIcon from '@material-ui/icons/AddBox';

// https://material-ui.com/components/tables/

function createData(name, bought, price) {
  return { name, bought, price };
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    flexGrow: 1,
  },

  container: {
    marginTop: "5%",
    marginLeft: "5%",
    marginRight: "5%",
    background: fade(theme.palette.secondary.light, 0.5),
  },

  toolbar: {
    width: "100%",
    display: "flex",
    background: fade(theme.palette.secondary.main, 0.85),
  },

  mainContentContainer: {
    width: "100%",
    padding: "3%",
  },

  typography: {
    align: "center",
    color: "inherit",
    textDecoration: "none",
  },

  typography_toolbar_header: {
    flexGrow: 1,
    align: "center",
    color: "inherit",
    textDecoration: "none",
    fontSize: "200%",
  },

  typography_header: {
    flexGrow: 1,
    align: "center",
    color: "inherit",
    textDecoration: "none",
    fontSize: "130%",
  },

  icon: {
    align: "right",
    fontSize: "200%",
    cursor: "pointer",
    "&:hover": {
      color: theme.palette.primary.dark,
    },
  },

  card: {
    cursor: "pointer",
  },

  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },

  table: {
    minWidth: 750,
  },

  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

const LISTS_API_URL = "http://localhost:1337/api/lists";

export default function ListPage() {
  const classes = useStyles();
  const { user, setUser } = useContext(UserContext);

  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toDashboard, setToDashboard] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [listData, setListData] = useState(null);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [addItemObject, setAddItemObject] = useState({
    name: '',
    bought: false,
    price: 0
  });

  const rows = listData === null || listData.listItems === null ? [{name:'',bought:false,price:0}] : listData.listItems.map((item) => (
    createData(item.name, item.bought, item.price)
  ));

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleAddItem = async (event) => {
    setAddItemObject(null);

    try { // @todo: add security check on backend so user cannot just change any list by changing url
      let search = window.location.search;
      let params = new URLSearchParams(search);
      let list_id = params.get("id");

      // get token for api call
      const token = Cookies.get("ogc_token");
      if (token === undefined) {
        Cookies.remove("ogc_token");
        setUser((state) => ({ ...state, loggedIn: false }));
      }

      if(list_id) {
        const res = await fetch(`${LISTS_API_URL}/addListItem?list_id=${list_id}`, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body:JSON.stringify(addItemObject)
        });

        if(res.ok) {
          setErrorMsg('Item added!');
          fetch_list_data();
        }
      } else {
        console.log("unable to find id");
        setToDashboard(true);
      }

      setAddItemObject(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSetAddItemName = (event) => {
    const name = event.target.value;
    setAddItemObject(state => ({...state, name: name}));
  };

  const fetch_list_data = async () => {
    try {
      // get id from query param 'id'
      let search = window.location.search;
      let params = new URLSearchParams(search);
      let list_id = params.get("id");

      // get token for api call
      const token = Cookies.get("ogc_token");
      if (token === undefined) {
        Cookies.remove("ogc_token");
        setUser((state) => ({ ...state, loggedIn: false }));
      }

      // if id of list was found in url query params
      if (list_id) {
        const res = await fetch(`${LISTS_API_URL}/list/?list_id=${list_id}`, {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setListData(data);
        } else {
          setErrorMsg(
            "Server responded with unknown error. Please try reopening the list"
          );
        }
      } else {
        console.log("unable to find id");
        setToDashboard(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect( () => {
    // Gets query parameter 'id' and makes initial request for list data
    fetch_list_data();
  }, []);

  return (
    <div className={classes.container}>
      <CssBaseline />
      {toDashboard ? <Redirect to="/dashboard" /> : ""}
      <div className={classes.toolbar}>
        {user.loggedIn ? "" : <Redirect to="/login" />}
        {isLoading ? <LinearProgress /> : ""}
        <ArrowBackIcon
          onClick={() => setToDashboard(!toDashboard)}
          className={classes.icon}
        ></ArrowBackIcon>
        <Typography className={classes.typography_toolbar_header}>
          {listData ? listData.name : ""}
        </Typography>
        <EditIcon
          onClick={() => setEditMode(!editMode)}
          className={classes.icon}
        ></EditIcon>
      </div>
      <div className={classes.mainContentContainer}>
        <Paper className={classes.paper}>
          <EnhancedTableToolbar numSelected={selected.length} />
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                <TableRow
                  hover
                  role="checkbox"
                  aria-checked={false}
                  tabIndex={-1}
                  id='row-add-item'
                  selected={false}
                >
                  <TableCell padding="checkbox">
                    <AddBoxIcon 
                      onClick={handleAddItem}
                    />
                  </TableCell>
                  <TableCell
                    component="th"
                    id='row-name-add-item'
                    scope="row"
                    padding="none"
                  >
                    <TextField
                      id='textfield-add-item'
                      label='Add item...'
                      fullWidth
                      value={addItemObject===null ? '' : addItemObject.name}
                      onChange={handleSetAddItemName}
                    />
                  </TableCell>
                  <TableCell id='checkbox-item-bought' align="right"></TableCell>
                  <TableCell id='price-item' align="right"></TableCell>
                </TableRow>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.name);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.name)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.name}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ "aria-labelledby": labelId }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.name}
                        </TableCell>
                        <TableCell align="right">{row.calories}</TableCell>
                        <TableCell align="right">{row.fat}</TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense padding"
        />
      </div>
    </div>
  );
}

// https://material-ui.com/components/tables/

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Item Name",
  },
  { id: "bought", numeric: false, disablePadding: false, label: "Bought?" },
  { id: "price", numeric: true, disablePadding: false, label: "Price" },
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Your Items
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};
