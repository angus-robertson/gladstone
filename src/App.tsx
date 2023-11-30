import { useState } from 'react';
import { ProjectMap } from './components/Map'
import { Box } from '@mui/material';
import { PopupInfo } from './utils/types';

import 'maplibre-gl/dist/maplibre-gl.css';
import { PopupSlider } from './components/PopupSlider';

export default function App() {
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null)

  return (
    <Box sx={{width: "100vw", height: "100vh", margin: 0}}>
      <ProjectMap setPopupInfo={setPopupInfo} />
      {popupInfo && <PopupSlider popupInfo={popupInfo} />}
    </Box>
  )
}