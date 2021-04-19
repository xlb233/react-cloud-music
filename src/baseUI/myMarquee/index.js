import styled from "styled-components";
import React, {useEffect, useRef} from "react";

const Content = styled.div`
  width: 120%;
  overflow: hidden;
  position: relative;
  height: 45px;
`;

const MyMarquee = (props) => {
    const txt = useRef();
    const outer = useRef();
    const {text} = props
    useEffect(() => {
        const outerWidth = outer.current.offsetWidth;
        const txtWidth = txt.current.offsetWidth;
        let w = outerWidth;
        const inter = setInterval(() => {
            w = (w + txtWidth) === 0 ? outerWidth : w - 1;
            txt.current.style.transform = `translate(${w}px)`;
        }, 15);
        return () => {
            clearInterval(inter)
        }
    }, []);
    return (
        <Content ref={outer}>
            <div ref={txt}>{text}</div>
        </Content>
    )
}
export default MyMarquee;