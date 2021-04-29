import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {getRankList} from "./store/actionCreators";
import Loading from '../../baseUI/loading';
import {
  List,
  ListItem,
  SongList,
  Container
} from './style';
import Scroll from '../../baseUI/scroll/index';
import {filterIndex} from '../../api/utils';
import {renderRoutes} from 'react-router-config';

function Rank(props) {
  const {rankList: list, loading, playlistCount} = props;

  const {getRankListDataDispatch} = props;

  let rankList = list ? list.toJS() : [];

  useEffect(() => {
    if (!rankList.length) {
      getRankListDataDispatch();
    }
    // eslint-disable-next-line
  }, []);

  // filterIndex函数找出全球榜的开头位置
  let globalStartIndex = filterIndex(rankList);
  // 前globalStartIndex个是官方榜
  let officialList = rankList.slice(0, globalStartIndex);
  // 剩下的是全球榜
  let globalList = rankList.slice(globalStartIndex);

  // 进入详情页面预留接口
  const enterDetail = (detail) => {
    props.history.push(`/rank/${detail.id}`)
  }
  // 官方榜的右侧歌曲列表
  const renderSongList = (list) => {
    return list.length ? (
      <SongList>
        {
          list.map((item, index) => {
            return <li key={item.first + item.second}>{index + 1}. {item.first} - {item.second}</li>
          })
        }
      </SongList>
    ) : null;
  }
  const renderRankList = (list, global) => {
    return (
      <List globalRank={global}>
        {
          list.map((item) => {
            return (
              <ListItem key={item.coverImgUrl} tracks={item.tracks} onClick={() => enterDetail(item)}>
                <div className="img_wrapper">
                  <img src={item.coverImgUrl} alt=""/>
                  <div className="decorate"/>
                  <span className="update_frequency">{item.updateFrequency}</span>
                </div>
                {renderSongList(item.tracks)}
              </ListItem>
            )
          })
        }
      </List>
    )
  }

  let displayStyle = loading ? {"display": "none"} : {"display": ""};
  return (
    <Container playlistLength={playlistCount}>
      <Scroll>
        <div>
          <h1 className="offical" style={displayStyle}>官方榜</h1>
          {renderRankList(officialList)}
          <h1 className="global" style={displayStyle}>全球榜</h1>
          {renderRankList(globalList, true)}
          {loading ? <Loading></Loading> : null}
        </div>
      </Scroll>
      {renderRoutes(props.route.routes)}
    </Container>
  );
}

// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
  rankList: state.getIn(['rank', 'rankList']),
  loading: state.getIn(['rank', 'loading']),
  playlistCount: state.getIn(['player', 'playlist']).size,
});
// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => {
  return {
    getRankListDataDispatch() {
      dispatch(getRankList());
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Rank));