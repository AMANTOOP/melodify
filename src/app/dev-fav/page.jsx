import React from 'react'
import SongsList from '../_components/songsList'

export default function page() {
  return (
    <>
    <div className=" min-h-[500px] max-h-[80vh] overflow-y-auto">
      <SongsList />
    </div>
    
    </>
  )
}
