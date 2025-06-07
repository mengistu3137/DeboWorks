const OverViewPage = () => {
  return (
      <div className='text-white'>
          <div className="flex justify-between">
              <div className="flex flex-col gap-2  w-max rounded-lg shadow-lg shadow-debo-blue/60 hover:animate-zoomIn   outline outline-debo-blue/50  hover:outline hover:outline-debo-green p-2">
              <h1>Posted vacancies</h1>
              <h4>vacancies:200</h4>
          </div>
              <div className="flex flex-col gap-2  w-max rounded-lg shadow-lg shadow-debo-blue/60 hover:animate-zoomIn   outline outline-debo-blue/50  hover:outline hover:outline-debo-green p-2">
              <h1>Totale Applicant</h1>
              <h4>applicants:200</h4>
          </div>
              <div className="flex flex-col gap-2  w-max rounded-lg shadow-lg shadow-debo-blue/60 hover:animate-zoomIn   outline outline-debo-blue/50  hover:outline hover:outline-debo-green p-2">
              <h1>short lists</h1>
              <h4>vacancies:200</h4>
          </div>
              
          </div>
          
    </div>
  )
}

export default OverViewPage