import { Box } from "@mui/material";
import { ProjectMap } from './components/Map'
import 'maplibre-gl/dist/maplibre-gl.css';

export default function App() {
  return (
    <Box sx={{width: "100vw", height: "100vh", margin: 0}}>
      <ProjectMap />
    </Box>
  )
}