import React, {useState, useEffect, useCallback, useRef} from "react";
import {CSSTransition} from "react-transition-group";
import {
  Container,
  ShortCutWrapper,
  FreqQueries,
  ListItem,
  List,
  SongItem
} from "./style";
import {SearchBox} from "../../baseUI/SearchBox";
import {connect} from "react-redux";
import Loading from "../../baseUI/loading";
import Scroll from "../../baseUI/scroll";
import LazyLoad, {forceCheck} from 'react-lazyload';
import {getName} from "../../api/utils";
import MusicalNote from '../../baseUI/musicNote';
import musicPlaceholder from "./music.png"
import singerPlaceHolder from "./singer.png"

import {
  getSuggestList,
  getFreqQueriesList,
  changeEnterLoading
} from "./store/actionCreators";
import {getSongDetail} from "../Player/store/actionCreators";

function Search(props) {
  const {
    freqQueriesList,
    suggestList: immutableSuggestList,
    resultList: immutableResultList,
    enterLoading,
    resNum
  } = props

  const {
    getFreqQueriesListDispatch,
    changeEnterLoadingDispatch,
    getSuggestListDispatch,
    getSongDetailDispatch
  } = props


  const suggestList = immutableSuggestList.toJS();
  const resultList = immutableResultList.toJS();

  const [show, setShow] = useState(false); // 是否显示搜索页面
  const [query, setQuery] = useState(''); // 输入搜索字符串（手动或点击热搜）

  const musicNoteRef = useRef(); // 点击歌曲时的音符

  useEffect(() => {
    setShow(true)
    if (!freqQueriesList.size) { // 若没有，则请求热搜列表
      getFreqQueriesListDispatch()
    }
  }, []);

  const searchBack = useCallback(() => {
    setShow(false);
  }, []);

  // 每次重新渲染都会创建一个新的handleQuery实例

  const handleQuery = useCallback((q) => { // 处理在输入框中打字和点击热搜的回调，显示联想列表
    if (!q) return;
    setQuery(q);
    changeEnterLoadingDispatch(true);
    getSuggestListDispatch(q);
  }, [query]);

  // 几个渲染函数
  const renderFreqQueries = () => {
    const queriesList = freqQueriesList ? freqQueriesList.toJS() : [];
    return (
      <ul>
        {
          queriesList.map(item => {
            return (
              <li
                className="item"
                key={item.first}
                onClick={() => setQuery(item.first)}
              >
                <span>{item.first}</span>
              </li>
            )
          })
        }
      </ul>
    )
  }
  // 渲染歌手
  const renderSingers = () => {
    let singers = suggestList.artists;
    if (!singers || !singers.length) return;
    return (
      <List>
        <h1 className="title"> 相关歌手 </h1>
        {
          singers.map((item) => {
            return (
              <ListItem
                key={item.id}
                onClick={() => props.history.push(`/singers/${item.id}`)}
              >
                <div className="img_wrapper">
                  <LazyLoad placeholder={<img width="100%" height="100%" src={singerPlaceHolder} alt="music"/>}>
                    <img src={item.picUrl} width="100%" height="100%" alt="music"/>
                  </LazyLoad>
                </div>
                <span className="name"> 歌手: {item.name}</span>
              </ListItem>
            )
          })
        }
      </List>
    )
  };
  // 渲染歌单
  const renderAlbum = () => {
    let albums = suggestList.playlists;
    if (!albums || !albums.length) return;
    return (
      <List>
        <h1 className="title"> 相关歌单 </h1>
        {
          albums.map((item) => {
            return (
              <ListItem
                key={item.id}
                onClick={() => props.history.push(`/album/${item.id}`)}>
                <div className="img_wrapper">
                  <LazyLoad placeholder={<img width="100%" height="100%" src={musicPlaceholder} alt="music"/>}>
                    <img src={item.coverImgUrl} width="100%" height="100%" alt="music"/>
                  </LazyLoad>
                </div>
                <span className="name"> 歌单: {item.name}</span>
              </ListItem>
            )
          })
        }
      </List>
    )
  };
  // 渲染歌曲列表
  const renderSongs = () => {
    return (
      <SongItem style={{paddingLeft: "20px"}}>
        {
          resultList.map(item => {
            return (
              <li key={item.id}
                  onClick={(e) => selectItem(e, item.id)}
              >
                <div className="info">
                  <span>{item.name}</span>
                  <span>
                  {getName(item.artists)} - {item.album.name}
                </span>
                </div>
              </li>
            )
          })
        }
      </SongItem>
    )
  };
  const selectItem = (e, id) => {
    getSongDetailDispatch(id);
    musicNoteRef.current.startAnimation({x: e.nativeEvent.clientX, y: e.nativeEvent.clientY});
  }
  return (
    <CSSTransition
      in={show}
      timeout={300}
      classNames="emerge"
      unmountOnExit
      onExited={() => {
        props.history.goBack()
      }}
    >
      <Container hasBottom={resNum}>
        {/*搜索框*/}
        <div className="search_box_wrapper">
          <SearchBox
            newQuery={query}
            back={searchBack}
            handleQuery={handleQuery}
          />
        </div>
        {/*在搜索框中没有值的时候显示的热搜选单*/}
        <ShortCutWrapper show={!query}>
          <FreqQueries>
            <h1 className="title">热门搜索</h1>
            {renderFreqQueries()}
          </FreqQueries>
        </ShortCutWrapper>
        {/*在搜索框有值的时候显示联想出来的选单，包括歌手，歌单，歌曲*/}
        <ShortCutWrapper show={query}>
          <Scroll onScroll={forceCheck}>
            {/*BScroll插件只允许内部有一个容器*/}
            <div>
              {renderSingers()}
              {renderAlbum()}
              {renderSongs()}
            </div>
          </Scroll>
        </ShortCutWrapper>
        {enterLoading ? <Loading/> : null}
        <MusicalNote ref={musicNoteRef}/>
      </Container>
    </CSSTransition>
  )
}

const mapStateToProps = (state) => {
  return {
    freqQueriesList: state.getIn(['search', 'freqQueriesList']),
    suggestList: state.getIn(['search', 'suggestList']),
    resultList: state.getIn(['search', 'resultList']),
    enterLoading: state.getIn(['search', 'enterLoading']),
    resNum: state.getIn(['player', 'playlist']).size, // 用于防止miniplayer遮挡
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getFreqQueriesListDispatch() {
      dispatch(getFreqQueriesList())
    },
    changeEnterLoadingDispatch(data) {
      dispatch(changeEnterLoading(data))
    },
    getSuggestListDispatch(data) {
      dispatch(getSuggestList(data))
    },
    getSongDetailDispatch(id) {
      dispatch(getSongDetail(id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Search));
