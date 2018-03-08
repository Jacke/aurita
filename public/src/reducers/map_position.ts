import { actionTypes } from '../common/constants/actionTypes';
import { PositionEntityContainer } from '../model';

const createEmptyPosition = (): PositionEntityContainer => (
  {
    localPosition: {lat: 0, lng: 0}, 
    globalPosition: {lat: 0, lng: 0}
  });

export const positionReducer = (state = createEmptyPosition(), action:any) => {
  switch (action.type) {
    case actionTypes.FETCH_MAP_POSITION:
      return handleFetchPosition(state, action.payload.mapPosition);
  }
  return state;
};

export const defaultPositionReducer = (state = createEmptyPosition(), action:any) => {
  switch (action.type) {
    case actionTypes.SET_DEFAULT_MAP_POSITION:
      return handleFetchPosition(state, action.payload);
  }
  return state;
};

const handleFetchPosition = (state: PositionEntityContainer, payload: PositionEntityContainer): PositionEntityContainer => {
  //return {
  //  Object.assign(state, { position: payload }) as PositionEntity
  //};  
  return payload;
};