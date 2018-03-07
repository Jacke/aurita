import { actionTypes } from '../common/constants/actionTypes';
import { MemberEntity } from '../model';

const createEmptyMember = (): MemberEntity => ({
  id: -1,
  login: '',
  avatar_url: '',
});

export const memberReducer = (state = createEmptyMember(), action:any) => {
  switch (action.type) {
    case actionTypes.FETCH_MEMBER_BY_ID_COMPLETED:
      return handleFetchMemberByIdCompleted(state, action.payload);
    case actionTypes.UPDATE_MEMBER_FIELD:
      return handleUpdateMemberField(state, action.payload);
  }

  return state;
};

const handleFetchMemberByIdCompleted = (state: MemberEntity, payload: MemberEntity): MemberEntity => {
  return payload;
};

const handleUpdateMemberField = (state: MemberEntity, payload: any): MemberEntity => {
  return {
    ...state,
    [payload.fieldValidationResult.key]: payload.value,
  };
};