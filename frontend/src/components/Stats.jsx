const Stats = () => {
      return (
         <section className="relative z-10 mx-auto -mt-8 max-w-5xl px-6">

        <div className="grid overflow-hidden rounded-3xl border border-slate-100
            bg-white shadow-xl shadow-slate-200/50 sm:grid-cols-3">

          <Stat
            number="25+"
            label="Years of Excellence"
          />

          <Stat
            number="120+"
            label="Expert Doctors"
          />

          <Stat
            number="50K+"
            label="Happy Patients"
          />

        </div>

      </section>
      )
    }

function Stat({number,label}){
  return(
    <div className="border-b border-slate-100 p-7 text-center last:border-0 sm:border-b-0 sm:border-r">
      <p className="text-3xl font-extrabold text-blue-600"> {number} </p>

      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  )
}
    
export default Stats
    