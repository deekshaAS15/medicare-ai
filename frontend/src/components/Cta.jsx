import {
  ChevronRight,
  MessageCircle,
} from "lucide-react";

const Cta = ({ onBookAppointment, onAI }) => {
  return (
    <>
      {/* Main CTA */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl rounded-4xl bg-linear-to-r from-blue-600 to-cyan-500 p-10 text-white shadow-2xl shadow-blue-200 sm:p-16">

          <div className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">

            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Ready to take care of your health?
              </h2>

              <p className="mt-3 max-w-xl text-blue-100">
                Talk to our AI assistant or book an appointment
                with one of our specialists.
              </p>
            </div>
            
            <button
              type="button"
              onClick={onBookAppointment}
              className="flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-4 font-bold text-blue-600 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              Book Appointment
              <ChevronRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </section>

      {/* Floating AI Button */}
      <button
        type="button"
        onClick={onAI}
        className="animate-pulse-custom fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl shadow-blue-300 transition hover:scale-105 hover:bg-blue-700"
        title="AI Assistant"
      >
        <MessageCircle size={28} />

        <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-[9px] font-bold">
          AI
        </span>
      </button>
    </>
  );
};

export default Cta;