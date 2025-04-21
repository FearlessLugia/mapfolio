export const Landing = () => {
  return (
    <section className='bg-white bg-cover bg-no-repeat bg-center h-[calc(100vh-76px)]'>
      <div
        className='sm:px-16 px-6 max-w-7xl mx-auto gap-5 absolute inset-0 flex flex-col justify-center items-center'
      >
        <div>
          <h1
            className='font-black lg:text-[80px] sm:text-[60px] xs:text-[50px] text-[40px] lg:leading-[98px] mt-2 text-black'>
            Hello, I&#39;m <span className='text-[#914eff]'>Kiiro</span>
          </h1>
          <p
            className='text-black font-medium lg:text-[30px] sm:text-[26px] xs:text-[20px] text-[16px] lg:leading-[40px] mt-2 text-white-100'>
            Full-Stack Web Development Engineer based in Toronto, ON
          </p>
          <br/>
          <br/>
          <p
            className='text-black font-medium lg:text-[30px] sm:text-[26px] xs:text-[20px] text-[16px] lg:leading-[40px] mt-2 text-white-100'>
            I&#39;m looking for either full-time or internship starting in September 2025!
          </p>
        </div>
      </div>
    </section>
  )
}
