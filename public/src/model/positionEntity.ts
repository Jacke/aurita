export interface PositionEntity {
  lat: number;
  lng: number;
}
export interface PositionEntityContainer {
  localPosition: PositionEntity;
  globalPosition: PositionEntity;
}
export interface MapPosition {
    lat: number;
    lng: number;
}