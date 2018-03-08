import axios from 'axios';
import { actions } from '../../actions/RootActions';
import { PositionEntity, PositionEntityContainer } from '../../model';

export const setNewMapPosition = (mapPosition: PositionEntityContainer) => ((dispatch:any) => {
  return dispatch(actions.fetchedPositionAction(({mapPosition})))
});

export const fetchPositionAction = () => ((dispatch:any) => {
  axios.get(`/api/v1/mapPosition`).then(res => {
    let result: PositionEntity = res.data 
    dispatch(actions.fetchedPositionAction(({mapPosition:
      {
        localPosition: result, 
        globalPosition: result
      }
    })));
  }).catch(error => {
    console.log(error);
  });
});
