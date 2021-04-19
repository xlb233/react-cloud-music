import React, {useState, useEffect, useRef, useCallback} from "react";
import {CSSTransition} from "react-transition-group";
import {Container, ImgWrapper, CollectButton, SongListWrapper, BgLayer} from "./style"
import SongsList from "../SongsList";
import Scroll from "../../baseUI/scroll";
import Header from "../../baseUI/header";
import {HEADER_HEIGHT} from "../../api/constant"


function Singer(props) {
  const [showStatus, setShowStatus] = useState(true)
  // mock数据
  const artist = {
    picUrl: "https://p2.music.126.net/W__FCWFiyq0JdPtuLJoZVQ==/109951163765026271.jpg",
    name: "薛之谦",
    hotSongs: [
      {
        name: "我好像在哪见过你",
        ar: [{name: "薛之谦"}],
        al: {
          name: "薛之谦专辑"
        }
      },
      {
        name: "我好像在哪见过你",
        ar: [{name: "薛之谦"}],
        al: {
          name: "薛之谦专辑"
        }
      },
      {
        name: "我好像在哪见过你",
        ar: [{name: "薛之谦"}],
        al: {
          name: "薛之谦专辑"
        }
      },
      {
        name: "我好像在哪见过你",
        ar: [{name: "薛之谦"}],
        al: {
          name: "薛之谦专辑"
        }
      },
      {
        name: "我好像在哪见过你",
        ar: [{name: "薛之谦"}],
        al: {
          name: "薛之谦专辑"
        }
      },      {
        name: "我好像在哪见过你",
        ar: [{name: "薛之谦"}],
        al: {
          name: "薛之谦专辑"
        }
      },
      {
        name: "我好像在哪见过你",
        ar: [{name: "薛之谦"}],
        al: {
          name: "薛之谦专辑"
        }
      },
      {
        name: "我好像在哪见过你",
        ar: [{name: "薛之谦"}],
        al: {
          name: "薛之谦专辑"
        }
      },
      {
        name: "我好像在哪见过你",
        ar: [{name: "薛之谦"}],
        al: {
          name: "薛之谦专辑"
        }
      },
      {
        name: "我好像在哪见过你",
        ar: [{name: "薛之谦"}],
        al: {
          name: "薛之谦专辑"
        }
      },
      {
        name: "我好像在哪见过你",
        ar: [{name: "薛之谦"}],
        al: {
          name: "薛之谦专辑"
        }
      },
      {
        name: "我好像在哪见过你",
        ar: [{name: "薛之谦"}],
        al: {
          name: "薛之谦专辑"
        }
      },
      {
        name: "我好像在哪见过你",
        ar: [{name: "薛之谦"}],
        al: {
          name: "薛之谦专辑"
        }
      },
      {
        name: "我好像在哪见过你",
        ar: [{name: "薛之谦"}],
        al: {
          name: "薛之谦专辑"
        }
      },      {
        name: "我好像在哪见过你",
        ar: [{name: "薛之谦"}],
        al: {
          name: "薛之谦专辑"
        }
      },      {
        name: "我好像在哪见过你",
        ar: [{name: "薛之谦"}],
        al: {
          name: "薛之谦专辑"
        }
      },
      {
        name: "我好像在哪见过你",
        ar: [{name: "薛之谦"}],
        al: {
          name: "薛之谦专辑"
        }
      },      {
        name: "我好像在哪见过你",
        ar: [{name: "薛之谦"}],
        al: {
          name: "薛之谦专辑"
        }
      },
      {
        name: "我好像在哪见过你",
        ar: [{name: "薛之谦"}],
        al: {
          name: "薛之谦专辑"
        }
      },
      {
        name: "我好像在哪见过你",
        ar: [{name: "薛之谦"}],
        al: {
          name: "薛之谦专辑"
        }
      },
      {
        name: "我好像在哪见过你",
        ar: [{name: "薛之谦"}],
        al: {
          name: "薛之谦专辑"
        }
      },
      {
        name: "我好像在哪见过你",
        ar: [{name: "薛之谦"}],
        al: {
          name: "薛之谦专辑"
        }
      },




      // 省略 20 条
    ]
  }
  const header = useRef();
  const imageWrapper = useRef();
  const collectButton = useRef();
  const songListWrapper = useRef();
  const bgLayer = useRef();
  const songScroll = useRef();
  const initialHeight = useRef(0);
  const OFFSET = 5;

  const setShowStatusFalse = useCallback(()=>{
    setShowStatus(false);
  }, [])

  const handleScroll = useCallback(pos => {
    let height = initialHeight.current;
    const newY = pos.y;
    const imgDOM = imageWrapper.current;
    const buttonDOM = collectButton.current;
    const headerDOM = header.current;
    const bgDOM = bgLayer.current;
    const minScrollY = -(height - OFFSET) + HEADER_HEIGHT;
    // 滑动距离占图片高度的百分比
    const percent = Math.abs (newY /height);
    if (newY > 0) {
      imgDOM.style["transform"] = `scale(${1 + percent})`;
      buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`;
      bgDOM.style.top = `${height - OFFSET + newY}px`;
    } else if (newY >= minScrollY) {
      bgDOM.style.top = `${height - OFFSET - Math.abs (newY)}px`;
      // 这时候保证遮罩的层叠优先级比图片高，不至于被图片挡住
      bgDOM.style.zIndex = 1;
      imgDOM.style.paddingTop = "75%";
      imgDOM.style.height = 0;
      imgDOM.style.zIndex = -1;
      // 按钮跟着移动且渐渐变透明
      buttonDOM.style ["transform"] = `translate3d(0, ${newY}px, 0)`;
      buttonDOM.style ["opacity"] = `${1 - percent * 2}`;
    } else if (newY < minScrollY) {
      // 往上滑动，但是超过 Header 部分
      bgDOM.style.top = `${HEADER_HEIGHT - OFFSET}px`;
      bgDOM.style.zIndex = 1;
      // 防止溢出的歌单内容遮住 Header
      headerDOM.style.zIndex = 100;
      // 此时图片高度与 Header 一致
      imgDOM.style.height = `${HEADER_HEIGHT}px`;
      imgDOM.style.paddingTop = 0;
      imgDOM.style.zIndex = 99;
    }
  }, []);

  useEffect(()=>{
    const h = imageWrapper.current.offsetHeight;
    songListWrapper.current.style.top = `${h-OFFSET}px`;
    initialHeight.current = h;
    bgLayer.current.style.top = `${h-OFFSET}px`;
    songScroll.current.refresh();
  },[])

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={props.history.goBack}
    >
      <Container>
        <Header
          title={artist.name}
          handleClick={setShowStatusFalse}
          ref={header}
          />
        <ImgWrapper
          bgUrl={artist.picUrl}
          ref={imageWrapper}
        >
          <div className="filter" />
        </ImgWrapper>
        <CollectButton ref={collectButton}>
          <i className="iconfont">&#xe62d;</i>
          <span className="text"> 收藏 </span>
        </CollectButton>
        <BgLayer ref={bgLayer} />
        <SongListWrapper ref={songListWrapper}>
          <Scroll
            ref={songScroll}
            onScroll={handleScroll}
          >
            <SongsList
              songs={artist.hotSongs}
              showCollect={false}
            />
          </Scroll>
        </SongListWrapper>
      </Container>
    </CSSTransition>
  )
}

export default React.memo(Singer)