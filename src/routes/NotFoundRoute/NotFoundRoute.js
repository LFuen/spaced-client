import React, { Component } from 'react'
import image from '../../images/404.png'
import './NotFound.css'

class NotFoundRoute extends Component {
  render() {
    return (
      <section className='notFound'>
        <h2 className='four'>404 - Page not found</h2>
        <img src={image} alt='Oh Crepe'/>
        <p>Try going back to your previous page.</p>
      </section>
    );
  }
}

export default NotFoundRoute
