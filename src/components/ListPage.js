import React, { useState, useEffect, useContext } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { UserContext } from './UserContext';

const useStyles = makeStyles(theme => ({

}));


export default function ListPage() {
    const classes = useStyles();
    const { user, setUser } = useContext(UserContext);

    return (
        <div>
            test
        </div>
    )
}