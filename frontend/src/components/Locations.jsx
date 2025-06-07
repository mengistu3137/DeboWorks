const Locations = () => {
    const locations = [
        { label: 'Addis Ababa', jobNo: '1538', value: 'addis_ababa' },
        { label: 'Alamata', jobNo: '1', value: 'alamata' },
        { label: 'Assosa', jobNo: '4', value: 'assosa' },
        { label: 'Bahir Dar', jobNo: '6', value: 'bahir_dar' },
        { label: 'Bedele', jobNo: '2', value: 'bedele' },
        { label: 'Dassenech', jobNo: '1', value: 'dassenech' },
        { label: 'Dessie', jobNo: '3', value: 'dessie' },
        { label: 'Dire Dawa', jobNo: '4', value: 'dire_dawa' },
        { label: 'Dukem', jobNo: '1', value: 'dukem' },
        { label: 'Gambela Jobs', jobNo: '9', value: 'gambela' },
        { label: 'Gondar', jobNo: '2', value: 'gondar' },
        { label: 'Holeta', jobNo: '1', value: 'holeta' },
        { label: 'Jinka', jobNo: '1', value: 'jinka' },
        { label: 'Logia', jobNo: '1', value: 'logia' },
        { label: 'Nekemte', jobNo: '1', value: 'nekemte' },
        { label: 'sebeta', jobNo: '1', value: 'sebeta' },
        { label: 'Sidama', jobNo: '1', value: 'sidama' },
        { label: 'Tigray Jobs', jobNo: '2', value: 'tigray' },
        { label: 'Woreta', jobNo: '1', value: 'woreta' },
    ]
    const length = locations.length
    const halfLength = Math.ceil(length / 2) // Rounds up to handle odd numbers
    const firstColLocations = locations.slice(0, halfLength)
    const secondColLocations = locations.slice(halfLength)
  return (
      <div className="flex flex-col items-center justify-center font-light text-white bg-debo-blue/25 w-[60%] h-fit  rounded-xl ">
          <div className="flex justify-around w-full">
              <div className="flex flex-col gap-2">
                  {firstColLocations.map(location => (
                      <div
                          key={location.value}
                          className="flex gap-2 items-center hover:text-blue-500 ">
                          <label
                              htmlFor={location.value}
                              className="cursor-pointer">
                              {location.label} <span className="px-3">{location.jobNo}</span>
                          </label>
                      </div>
                  ))}
              </div>
              <div className="flex flex-col gap-2">
                  {secondColLocations.map(location => (
                      <div
                          key={location.value}
                          className="flex gap-2 items-center hover:text-blue-500">
                          <label
                              htmlFor={location.value}
                              className="cursor-pointer">
                              {location.label}
                              <span className="px-3">{location.jobNo}</span>
                          </label>
                      </div>
                  ))}
              </div>
          </div>
      </div>
  )
}

export default Locations