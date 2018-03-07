import { createAction } from 'typesafe-actions';
import {RouterAction, LocationChangeAction} from 'react-router-redux';
export const actions = {
  increment: createAction('INCREMENT'),
  add: createAction('ADD', (amount: number) => ({
    type: 'ADD',
    payload: amount,
  })),
};

const returnsOfActions = Object.values(actions).map(a => a.call);
type AppAction = typeof returnsOfActions[number];

// third-party actions
type ReactRouterAction = RouterAction | LocationChangeAction;

export type RootAction =
  | AppAction
  | ReactRouterAction;