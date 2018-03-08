import { combineReducers } from 'redux';
import { PositionEntityContainer } from '../model';
import { positionReducer } from './map_position';

export interface State {
  mapPositions: PositionEntityContainer;
};

export const state = combineReducers<State>({
  mapPositions: positionReducer,
});
