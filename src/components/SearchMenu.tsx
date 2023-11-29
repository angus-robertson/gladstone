import React, { useState } from 'react';
import { Box, Fade, IconButton, InputAdornment, List, ListItemButton, ListItemIcon, ListItemText, SwipeableDrawer, TextField, styled, useMediaQuery } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import theme from '../theme/theme';
import { LeftSidePanel } from './LeftSidePanel';
import { Close } from '@mui/icons-material';
import { GeoJSONFeature } from 'maplibre-gl';
import { GeoJsonProperties } from 'geojson';
import CircleIcon from '@mui/icons-material/Circle';

interface SearchProps {
    searchString: string;
    searchPoints: Map<string, GeoJSONFeature>;
    stringSetter: (string: string) => void;
    selectedSetter: (string: string) => void;
}

//TODO: refactor this as it duplicates layer style in Map.tsx
const getCategoryColor = (category: string) => ({
    'Solar': '#fff201bf',
    'Wind': '#4db802bf',
    'Bioenergy': '#39b1b7bf',
    'Battery storage': '#c43b3fbf',
    'Hydro': '#3548a0bf',
    'Hydrogen': '#08f70abf'
}[category]);

export const Search: React.FC<SearchProps> = (props):React.JSX.Element => {
    const [selectedResult, setSelectedResult] = useState<number>(0)
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const mobile = useMediaQuery(theme.breakpoints.down('md'));

    const toggleDrawer = (showSearch: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event && 
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
            ) {
                return;
            }
            setShowSearch(showSearch);
    };

    const handleClear = () => {
        props.stringSetter('');
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.stringSetter(event.target.value);
    }
    
    const handleResultClick = (result: string, index: number) => {
        props.selectedSetter(result);
        setSelectedResult(index);
        if (mobile) setShowSearch(false);
    };

    const ResultList = styled(List)( () => ({
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch'
    }));

    // Styled toggle search button
    const ToggleSearch = styled(IconButton)( ({theme}) => ({
        position: 'fixed',
        top: theme.spacing(2),
        left: 16,
        backgroundColor: '#fbfbfb90',
        backdropFilter: 'blur(4px)',
        boxShadow: '0px 6px 6px -3px #33000000,0px 10px 14px 1px #24000000,0px 4px 18px 3px $1f000000'
    }));
 
    // Render single search result
    const renderResult = (properties: GeoJsonProperties) => {
        if (!properties) { return null; }

        return (
            <>
                <ListItemIcon sx={{ ml: 1 }}>
                    <CircleIcon fontSize='small' htmlColor={getCategoryColor(properties['fuel_type'])} />
                </ListItemIcon>
                <ListItemText
                    sx={{ ml:-2 }}
                    primary = {properties ? properties['project_name'] : 'Name not found'}
                    secondary = {properties ? `${properties['fuel_type']} • ${properties['status']}` : 'Name not found'} 
                />
            </>
        )
    };

    // Render list of search results
    const renderResultsList = () => {
        //if(!props.searchString) {return null}

        const points = Array.from(props.searchPoints.entries());
        const results = [...points];

        if(props.searchString && results.length < 1) {
            return (
                <ResultList disablePadding>
                    <ListItemButton disabled>
                        <ListItemText primary='No items found.' />
                    </ListItemButton>
                </ResultList>
            );
        }

        return (
            <ResultList disablePadding>
                {results.filter( (result) => result[0].includes(props.searchString)).map( (result, index) => (
                    <ListItemButton
                        selected={selectedResult === index}
                        dense
                        key={result[0]}
                        onClick={ () => handleResultClick(result[0], index)}
                    >
                        {renderResult(result[1].properties)}
                    </ListItemButton>
                ))}
            </ResultList>
        );
    };


    return (
        <>
            <ToggleSearch 
                onClick={toggleDrawer(true)}
                sx={[{
                    boxShadow: '0 0 0 2px rgba(0,0,0,.1)',
                    background: '#fff'
                },
                {
                    '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.05)'
                    }
                }]}
            >
                <SearchIcon color='primary' />
            </ToggleSearch>
            <SwipeableDrawer
                ModalProps={{
                    keepMounted: true
                }}
                anchor="left"
                variant={mobile ? 'temporary' : 'persistent'}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
                open={showSearch}
                PaperProps={{
                    sx: {
                        backgroundColor: 'rgba(255, 255, 255, 0.75)',
                        backdropFilter: 'blur(4px)',
                        boxShadow: '0px 6px 6px -3px #33000000,0px 10px 14px 1px #24000000,0px 4px 18px 3px $1f000000'
                    }
                }}
            >
                <LeftSidePanel
                    title='Search'
                    onClose={toggleDrawer(false)}
                    disablePadding
                >
                    <Box pl={3} pr={3}>
                        <TextField
                            variant='standard'
                            value={props.searchString}
                            sx={{width: '100%', pb: 0.5}}
                            placeholder='Search...'
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <Fade in={!!props.searchString}>
                                            <IconButton
                                                size='small'
                                                aria-label='clear search'
                                                title='Clear'
                                                onClick={handleClear}
                                            >
                                                <Close />
                                            </IconButton>
                                        </Fade>
                                    </InputAdornment>
                                )
                            }}
                        >

                        </TextField>
                    </Box>
                    {renderResultsList()}
                </LeftSidePanel>
            </SwipeableDrawer>
        </>
    )

}