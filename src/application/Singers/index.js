import { render } from "@testing-library/react"
import React from "react"

function Singers(props) {
  return (
    <div>Singers</div>
  )
}

export default React.memo(Singers);