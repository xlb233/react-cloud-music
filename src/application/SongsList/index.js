// 重构歌曲列表页面，提供给Album和Singer组件调用
import React from "react";
import {SongList, SongItem} from "./style"
import {getName} from "../../api/utils";

import {changePlaylist, changeCurrentIndex, changeSequencePlaylist} from "../Player/store/actionCreators";
import {connect} from "react-redux";


const SongsList = React.forwardRef((props, ref) => {
  const {collectCount, showCollect, songs, playlistLength} = props;
  const { musicNoteAnimation } = props; // 点击后的音符陨落动画
  const {changePlaylistDispatch, changeCurrentIndexDispatch, changeSequencePlaylistDispatch} = props;
  const totalCount = songs.length;
  // 点击歌曲后的事件
  const selectItem = (e, index) => {
    changePlaylistDispatch(songs);
    changeSequencePlaylistDispatch(songs);
    changeCurrentIndexDispatch(index);
    musicNoteAnimation(e.nativeEvent.clientX, e.nativeEvent.clientY); // 从点击事件触发的位置播放音符陨落动画
  }
  // 歌曲列表
  const songList = (list) => {
    let res = [];
    for (let i = 0; i < list.length; i++) {
      let item = list[i];
      res.push(
        <li key={item.id} onClick={(e) => selectItem(e, i)}>
          <span className="index">{i + 1}</span>
          <div className="info">
            <span>{item.name}</span>
            <span>
              {item.ar ? getName(item.ar) : getName(item.artists)} - {item.al ? item.al.name : item.album.name}
            </span>
          </div>
        </li>
      )
    }
    return res;
  }

  // 收藏数，Album组件会用到
  const collect = (count) => {
    return (
      <div className="add_list">
        <i className="iconfont">&#xe62d;</i>
        <span>收藏({Math.floor(count/1000)/10}万)</span>
      </div>
    )
  }

  return (
    <SongList ref={ref} showBackground={props.showBackground}>
      <div className="first_line">
        <div className="play_all" onClick={(e) => selectItem(e, 0)}>
          <i className="iconfont">&#xe6e3;</i>
          <span > 播放全部 <span className="sum">(共 {totalCount} 首)</span></span>
        </div>
        {/*在歌手详情页面不用显示收藏数*/}
        { showCollect ? collect (collectCount) : null}
      </div>
      <SongItem>
        {songList(songs)}
      </SongItem>
    </SongList>
  )
})

const mapDispatchToProps = (dispatch) => {
  return {
    changePlaylistDispatch(data) {
      dispatch(changePlaylist(data));
    },
    changeSequencePlaylistDispatch(data) {
      dispatch(changeSequencePlaylist(data));
    },
    changeCurrentIndexDispatch(data) {
      dispatch(changeCurrentIndex(data));
    }
  }
}

export default connect(null, mapDispatchToProps)(React.memo(SongsList))