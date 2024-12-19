import React from 'react';

const Post = ({data}) => {
  return (
    <>
    {data.map((item, index)=>{
      return <div className='post w-full p-2 mb-3 flex flex-col  text-left bg-[#1c1e21] border-b border-b-[#323334]' key={item.id}>
        <div className='flex space-x-2 p-1'>
          <img className='h-8 rounded-3xl'  src={item.image} alt="" />
          <p className='inline-block w-full font-sans '>{item.username}</p>
        </div>
        <div className='flex flex-col'>
          <div className='p-1 mb-1'>
            {item.text}
          </div>
          <div className='p-1'>
            <img className='h-42' src={item.image} alt="" />
          </div>
        </div>
        <div className='flex justify-start space-x-2 pl-1'>
          <button>like</button>
          <button>comment</button>
          <button>share</button>
        </div>
      </div>
    })}
    </>
  );
};

export default Post;
