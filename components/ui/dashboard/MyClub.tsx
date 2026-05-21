
type Club = {
  clubName?: string
  clubId?: string
  clubAddress?: string
  clubAdmin?: string
}

const MyClub = async (props: { club: Club }) => {
  const { clubName, clubId, clubAddress, clubAdmin } = props.club || {}

  return (
    <div className="md:max-w-[650px] h-fit border shadow-xl flex  flex-col gap-2 px-5 py-5 rounded-2xl ">
      <h1 className="text-xl font-semibold">My Club</h1>

      <ul className="flex flex-col gap-2">
        <div>
          <li className="font-light text-xs">clubId: </li>
          <li>{clubId} </li>
        </div>
        <div>
          <li className="font-light text-xs">clubName: </li>
          <li> {clubName} </li>
        </div>

        <div>

          <li className="font-light text-xs">clubAdmin: </li>
          <li> {clubAdmin} </li>
        </div>

        <div>
          <li className="font-light text-xs">clubAddress: </li>
          <li> {clubAddress} </li>
        </div>
      </ul>
    </div>
  )
}

export default MyClub
