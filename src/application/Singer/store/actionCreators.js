import {CHANGE_ARTIST, CHANGE_ENTER_LOADING, CHANGE_SONGS_OF_ARTIST} from "./constants";
import {fromJS} from "immutable";
import {getSingerInfoRequest} from "../../../api/request";

const changeArtist = (data) => {
  return {
    type: CHANGE_ARTIST,
    data: fromJS(data),
  }
}

const changeSongsOfArtist = (data) => {
  return {
    type: CHANGE_SONGS_OF_ARTIST,
    data: fromJS(data),
  }
}

export const changeEnterLoading = (data) => {
  return {
    type: CHANGE_ENTER_LOADING,
    data
  }
}

export const getSingerInfo = (id) => {
  return dispatch => {
    getSingerInfoRequest(id).then(data => {
      dispatch(changeArtist(data.artist));
      dispatch(changeSongsOfArtist(data.hotSongs));
      dispatch(changeEnterLoading(false))
    })
  }
}
