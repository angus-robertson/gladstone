import { Box, Collapse, Divider, Fade, IconButton, Stack, Typography, styled, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import theme from "../theme/theme";
import { PopupInfo } from '../utils/types';
import { ExpandLess, ExpandMore, InfoOutlined } from "@mui/icons-material";
import { useElementSize } from "../utils/useElementSize";

interface PopupProps {
    popupInfo: PopupInfo
}

const sliderWidth = 500;

const SlideDrawer = styled(Collapse)( ({theme}) => ({
    position: 'fixed',
    bottom: 0,
    left: 0,
    zIndex: 1000,
    backgroundColor: `${theme.palette.primary.main}f2`,
    color: theme.palette.common.white,
    backdropFilter: 'blur(4px)',
    //boxshadow
    [theme.breakpoints.down('md')]: {
        right: 0
    },
    [theme.breakpoints.up('md')]: {
        top: 0,
        width: sliderWidth
    }
}));

const SliderTitle = styled(Stack)( ({theme}) => ({
    backgroundColor: `${theme.palette.primary.dark}b3`,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2)
}));

const SliderContent = styled(Stack)( ({theme}) => ({
    padding: theme.spacing(3),
    width: sliderWidth,
    overflow: 'auto',
    [theme.breakpoints.up('md')]: {
        paddingBottom: theme.spacing(7)
    }
}));

export const PopupSlider: React.FC<PopupProps> = ({popupInfo}): React.JSX.Element => {
    const {properties} = popupInfo;
    const { ref, height } = useElementSize();
    const [open, setOpen] = useState(true);
    const mobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect( () => {
        setOpen(true);
    }, [popupInfo]);

    const toggleDrawer = () => setOpen(!open);

    const renderInfo = () => {
        return (
            <>
                {properties!["description"] && (
                <Stack direction='row' spacing={3}>
                    <Typography variant='body2'>{properties!["description"]}</Typography>
                </Stack>    
                )}
                {properties!["Details"] && (
                <Stack direction='row' spacing={3}>
                    <Typography variant='body2'>{properties!["Details"]}</Typography>
                </Stack>    
                )}
                <Stack direction='row' spacing={2}>
                    <Stack alignItems='center' spacing={2}>
                        <InfoOutlined htmlColor={theme.palette.common.white} />
                        <Divider orientation='vertical' variant='middle' />
                    </Stack>
                    <Stack spacing={2} sx={{maxWidth: 'calc(100% - 38px)'}}>
                        <Typography variant='h6'>Information</Typography>
                        {properties!["status"] && (<Typography>Status: {properties!["status"]}</Typography>)}
                        {properties!["FuelCategory"] && (<Typography>Fuel Category: {properties!["FuelCategory"]}</Typography>)}
                        {properties!["fuel_type"] && (<Typography>Fuel Type: {properties!["fuel_type"]}</Typography>)}
                        {properties!["FuelSubType"] && (<Typography>Fuel Sub Type: {properties!["FuelSubType"]}</Typography>)}
                        {properties!["organisation"] && (<Typography>Owner: {properties!["organisation"]}</Typography>)}
                        {properties!["YearCommissioning"] && (<Typography>Commissioned: {properties!["YearCommissioning"]}</Typography>)}
                        {properties!["Capacity"] && (<Typography>Capacity: {properties!["Capacity"]} MW</Typography>)}
                        {properties!["LGA"] && (<Typography>LGA: {properties!["LGA"]}</Typography>)}
                        {properties!["Source"] && (<Typography>Source: {properties!["Source"]}</Typography>)}
                        {properties!["reference"] && (<Typography>Source: {properties!["reference"]}</Typography>)}
                    </Stack>
                </Stack>
            </>
        )

    }

    const renderTitle = () => (
        <Box ref={ref}>
            <SliderTitle direction='row'>
                <Stack
                    direction='row'
                    alignItems='center'
                    spacing={2}
                >
                    {mobile ? (
                        <Stack>
                            <Typography variant='h4'>{properties!['project_name']}</Typography>
                            <Typography variant='body2'>{properties!['fuel_type']}</Typography>
                        </Stack>
                    ) : (
                        <Fade in={open}>
                            <Stack>
                                <Typography variant='h4'>{properties!['project_name']}</Typography>
                                <Typography variant='body2'>{properties!['fuel_type']}</Typography>
                            </Stack>
                        </Fade>
                    )}    
                </Stack>
                {mobile && (
                    <IconButton onClick={toggleDrawer} color='inherit'>
                        {open ? <ExpandMore /> : <ExpandLess />}
                    </IconButton>
                )}
            </SliderTitle>
        </Box>
    );

    const renderDesktopViews = () => {
        return (
            <SliderContent>
                <Box mb={3}>
                    <Stack spacing={1}>
                        {renderInfo()}
                    </Stack>
                </Box>
            </SliderContent>
        )
    };

    return (
        <SlideDrawer 
            in={open}
            orientation={ mobile ? 'vertical' : 'horizontal' }
            collapsedSize={height}
        >
            {renderTitle()}
            {renderDesktopViews()}
        </SlideDrawer>
    )

};