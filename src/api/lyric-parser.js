const STATUS_PAUSE = 0;
const STATUS_PLAYING = 1;
const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g; // 匹配时间戳
export default class LyricParser {
  /**
   * @params {string} lrc
   * @params {function} handler
   */
  constructor(lrc, handler = () => {
  }) {
    this.lrc = lrc;
    this.handler = handler;
    this.lines = []; // 解析后的数组
    this.state = STATUS_PAUSE; // 当前播放状态
    this.curLineIndex = 0; // 当前播放歌词所在的行数
    this.startTimestamp = 0; // 开始时间戳
    this._initLines(); // 初始化歌词
  }

  _initLines() {
    const lyricLines = this.lrc.split('\n'); // 按行分割歌词
    lyricLines.forEach((line) => {
      // 获得时间戳数组，形如["[00:01.997]", "00", "01", "997", index: 0, input: "[00:01.997] 作词：薛之谦", groups: undefined]
      let res = timeExp.exec(line);
      const txt = line.replace(timeExp, '').trim(); // 歌词部分
      if (txt) {
        this.lines.push({
          timestamp: res[1] * 60 * 1000 + res[2] * 1000 + Number(res[3]), // 将时间戳00:01.997从分:秒.毫秒的格式转化为毫秒单位的格式
          txt
        })
      }
      this.lines.sort((a, b) => {
        return a.timestamp - b.timestamp; // 按时间升序排序
      })
    })
  }

  play(offset = 0, isSeek = false) { //offset 为时间进度，isSeek 标志位表示用户是否手动调整进度
    if (!this.lines.length) return
    this.startTimestamp = +new Date() - offset; // 找到起始时间
    this.state = STATUS_PLAYING;
    this.curLineIndex = this._findCurIndex(offset); // 找到马上要播放的歌词所在行
    // 处理当前行
    this._callHandler (this.curLineIndex-1, this.handler);
    if (this.curLineIndex < this.lines.length) {
      // 每句歌词播放完后都重新计时。
      clearTimeout (this.timer);
      this._playRest(isSeek);
    }
  }

  stop() {
    this.state = STATUS_PAUSE;
    // 清空当前歌曲的计时器，防止切歌后还在计时导致的当前歌曲显示错误
    clearTimeout(this.timer);
  }

  seek(offset) {
    this.play(offset, true)
  }

  togglePlay(offset) {
    if (this.state === STATUS_PLAYING) {
      this.stop()
    } else {
      this.state = STATUS_PAUSE
      this.play(offset, true)
    }
  }

  // 找到即将播放的下一句歌词所在的下标
  // 因为time可能在两句歌词中间，所以需要time <= this.lines[i].timestamp
  _findCurIndex(time) {
    for (let i = 0; i < this.lines.length; i++) {
      if (time <= this.lines[i].timestamp) {
        return i // 找到第一个比传入time大的行数
      }
    }
    return this.lines.length - 1
  }

  _callHandler(index) {
    if (index < 0) return
    this.handler(index, this.lines[index].txt)
  }

  _playRest(isSeek=false) {
    let line = this.lines[this.curLineIndex];
    let delay; // 距离下一句歌词开始播放的时间
    if (isSeek) {
      delay = line.timestamp - (+new Date() - this.startTimestamp);
    } else {
      let preTime = this.lines[this.curLineIndex - 1] ? this.lines[this.curLineIndex - 1].timestamp : 0;
      delay = line.timestamp - preTime;
    }
    this.timer = setTimeout(()=>{
      this._callHandler(this.curLineIndex++, this.handler);
      if (this.curLineIndex < this.lines.length && this.state === STATUS_PLAYING) {
        this._playRest ();
      }
    },delay)
  }
}