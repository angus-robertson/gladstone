import { GeoJsonProperties } from 'geojson';

export interface PopupInfo {
    properties: GeoJsonProperties;
    longitude: number;
    latitute: number;
    onClose: () => void;
}