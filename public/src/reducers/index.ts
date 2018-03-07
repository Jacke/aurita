import { combineReducers } from 'redux';
import { MemberEntity } from '../model';
import { membersReducer } from './members';
import { memberReducer } from './member';

export interface State {
  members: MemberEntity[];
  member: MemberEntity;
};

export const state = combineReducers<State>({
  members: membersReducer,
  member: memberReducer,
});
