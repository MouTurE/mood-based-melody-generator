import React from 'react'
import "./InnerCard.css"


function InnerCard(props) {
  return (
    <div style={{alignItems: props.alignItems}} className='inner-card'> {props.children} </div>
  )
}

export default InnerCard