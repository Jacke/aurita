import { createAction } from 'typesafe-actions';
import {RouterAction, LocationChangeAction} from 'react-router-redux';
import { actionTypes } from '../common/constants/actionTypes';
import { PositionEntityContainer } from '../model';

export const actions = {
  fetchedPositionAction: createAction(actionTypes.FETCH_MAP_POSITION, (mapPosition: {mapPosition: PositionEntityContainer}) => ({
    type: actionTypes.FETCH_MAP_POSITION,
    payload: mapPosition,
  })),
};

const returnsOfActions = Object.values(actions).map(a => a.call);
type AppAction = typeof returnsOfActions[number];

// third-party actions
type ReactRouterAction = RouterAction | LocationChangeAction;

export type RootAction =
  | AppAction
  | ReactRouterAction;