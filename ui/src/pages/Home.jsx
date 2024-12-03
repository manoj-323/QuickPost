import React from "react"
import { useState, useEffect } from "react"

export default function Home(){
  let data = []

  async function fetchData(url){

  }

  useEffect(()=>{
    fetchData('http://127.0.0.1:8000/feed/')
  }, [])

  return (
    <div className="bg-slate-950 h-screen flex">
      <div className="border mt-20 mb-16 mx-auto text-center overflow-y-auto no-scrollbar">
        main
      </div>
    </div>
  )
}