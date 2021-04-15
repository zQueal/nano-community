import React from 'react'

import './menu.styl'

export default class Menu extends React.Component {
  render() {
    return (
      <div className='menu__container'>
        <div className='menu__section'>
          <div className='menu__heading'>Introduction</div>
          <div className='menu__links'>
            <a>History</a>
            <a>Why Nano?</a>
            <a>Myths</a>
            <a>FAQs</a>
          </div>
        </div>
        <div className='menu__section'>
          <div className='menu__heading'>Get Started</div>
          <div className='menu__links'>
            <a>Storing</a>
            <a>Purchasing</a>
            <a>Transacting</a>
            <a>Best Practices</a>
          </div>
        </div>
        <div className='menu__section'>
          <div className='menu__heading'>Learn & Get Help</div>
          <div className='menu__links'>
            <a>Design</a>
            <a>Advantages</a>
            <a>Attack Vectors</a>
            <a>Roadmap</a>
            <a>Support</a>
          </div>
        </div>
        <div className='menu__section'>
          <div className='menu__heading'>Developers</div>
          <div className='menu__links'>
            <a>Github</a>
            <a>Documentation</a>
            <a>Integration</a>
            <a>Whitepaper</a>
          </div>
        </div>
        <div className='menu__section'>
          <div className='menu__heading'>Get Involved</div>
          <div className='menu__links'>
            <a>Contributing</a>
            <a>Community</a>
          </div>
        </div>
      </div>
    )
  }
}