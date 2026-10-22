import {HeartPulse, ShieldCheck,Users,} from "lucide-react";

const About = () => {
  return (
    <section id="about" className="bg-blue-50 py-24">
        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

            <div>

              <p className="font-semibold uppercase tracking-widest text-blue-600">
                Why MediCare?
              </p>

              <h2 className="mt-3 text-4xl font-bold">
                Modern technology.<br />Human care.
              </h2>

              <div className="mt-8 space-y-6">

                <Feature
                  icon={<HeartPulse />}
                  title="Patient-first care"
                  text="Everything is designed around making your healthcare journey easier."
                />

                <Feature
                  icon={<ShieldCheck />}
                  title="Trusted & secure"
                  text="Your healthcare information should always be handled responsibly."
                />

                <Feature
                  icon={<Users />}
                  title="Experienced specialists"
                  text="Get connected with qualified doctors across different specialties."
                />

              </div>
            </div>

            <div className="overflow-hidden rounded-4xl shadow-2xl">

              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=85"
                alt="Healthcare professionals"
                className="w-full transition duration-700 hover:scale-105"
              />

            </div>

          </div>

        </div>

      </section>
  )
}

function Feature({icon,title,text}){
  return(
    <div className="flex gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center px-3 rounded-xl bg-white text-blue-600 shadow-sm">
        {icon}
      </div>

      <div>
        <h3 className="font-bold"> {title} </h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>

      </div>
    </div>

  )
}

export default About
