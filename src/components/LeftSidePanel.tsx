import { ChevronLeft } from "@mui/icons-material";
import { Button, Tooltip, Typography, useMediaQuery, IconButton, styled, Toolbar, Box } from '@mui/material';
import theme from "../theme/theme";


interface Props {
    title: string;
    onClose: (event: React.KeyboardEvent | React.MouseEvent) => void;
    children: React.ReactNode;
    disablePadding?: boolean;
}

const StyledToolbar = styled(Toolbar)( () => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
}));

const Wrapper = styled(Box)( ({theme}) => ({
    position: 'relative',
    overflow: 'hidden',
    width: '100vw',
    height: '100vh',
    [theme.breakpoints.up('md')]: {
        width: 400,
    }
}));

const Container = styled(Box)( () => ({
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    maxWidth: '100%',
    maxHeight: 'calc(100% - 64px)',
    overflowX: 'auto',
    flex: 1,
    WebkitOverflowScrolling: 'touch',
}));

export const LeftSidePanel: React.FC<Props> = ({
    title,
    onClose,
    children,
    disablePadding
}): React.JSX.Element => {
    const mobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Wrapper>
            <StyledToolbar>
                <Typography variant='h4' color='#00417d'>{title}</Typography>
                {mobile ? (
                    <Button
                        onClick={onClose}
                        color='primary'
                        endIcon={ <ChevronLeft /> }
                        sx={{ ml: -1 }}
                    >
                        Close
                    </Button>
                ) : (
                    <Tooltip title='Close panel'>
                        <IconButton
                            onClick={onClose}
                            color='primary'
                            sx={{ ml: -1 }}
                        >
                            <ChevronLeft />
                        </IconButton>
                    </Tooltip>
                )}
            </StyledToolbar>
            <Container
                    sx={{padding: disablePadding ? 0 : theme.spacing(3)}}
            >
                {children}
            </Container>
        </Wrapper>
    )
}