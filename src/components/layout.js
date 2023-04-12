'use client'
import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }) {
  return (
    <>
     <div className="flex flex-col min-h-screen">
        <Navbar/>
        <div className="flex-1">
            <main>{children}</main>
        </div>
        <Footer />
      </div>
    </>
  )
}