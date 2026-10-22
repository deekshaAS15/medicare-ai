import { useState } from "react";

import Welcome from "./components/Welcome";
import Login from "./components/Login";
import Register from "./components/Register";
import Appointment from "./components/Appointment";
import MyAppointments from "./components/MyAppointments";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Services from "./components/Services";
import Departments from "./components/Departments";
import Doctors from "./components/Doctors";
import About from "./components/About";
import AI from "./components/AI";
import Cta from "./components/Cta";
import DoctorProfile from "./components/DoctorProfile";
import Footer from "./components/Footer";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import AdminSetup from "./components/AdminSetup";
import ForgotPassword from "./components/ForgotPassword";

function App() {
  const [page, setPage] = useState(()=>{
    if(localStorage.getItem("admin_access_token")){
      return "admin-dashboard";
    }
    if (localStorage.getItem("access_token")){
      return "home"
    }
    return "welcome";
  });

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("access_token")
  );

  const [selectedDoctor, setSelectedDoctor] = useState(() => {
    const savedDoctor = localStorage.getItem("selected_appointment_doctor");
    return savedDoctor ? JSON.parse(savedDoctor) : null;
  });

  const [showAppointment, setShowAppointment] = useState(localStorage.getItem("current_view")==="appointment");

  const [showMyAppointments, setShowMyAppointments] = useState(localStorage.getItem("current_view")==="my-appointments");
  
  const [selectedDepartment,setSelectedDepartment] = useState("");
  const [selectedProfileDoctor,setSelectedProfileDoctor] = useState(() =>{
    const savedDoctor = localStorage.getItem("selected_profile_doctor");
    return savedDoctor ? JSON .parse(savedDoctor) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("current_view");
    localStorage.removeItem("selected_profile_doctor");
    localStorage.removeItem("selected_appointment_doctor");

    setIsLoggedIn(false);
    setShowAppointment(false);
    setShowMyAppointments(false);
    setSelectedProfileDoctor(null);
    setSelectedDoctor(null);
    setSelectedDepartment("");
    setPage("welcome");
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setPage("home");
  };

  // Admin login

  if (page === "admin-login"){
    return(
      <AdminLogin 
       onLogin={()=>setPage("admin-dashboard")}
       onBack={()=>setPage("welcome")}
      />
    )
  }

  // Admin dashboard

  if (page === "admin-dashboard") {
  return (
    <AdminDashboard
      onLogout={() => {
        localStorage.removeItem("admin_access_token");
        localStorage.removeItem("admin_logged_in");

        setPage("welcome");
      }}
    />
  );
}

// Admin setup

if (page === "admin-setup") {
  return (
    <AdminSetup
      onCreated={() => setPage("admin-login")}
      onBack={() => setPage("welcome")}
    />
  );
}

  // Login Page
  if (page === "login") {
    return (
      <Login
        onLogin={handleLogin}
        onRegister={() => setPage("register")}
        onForgotPassword={()=>setPage("forgot-password")}
        onBack={() => setPage("welcome")}
      />
    );
  }
  
  // Register Page
  if (page === "register") {
    return (
      <Register
        onRegister={() => setPage("login")}
        onLogin={() => setPage("login")}
        onBack={() => setPage("welcome")}
      />
    );
  }

  // Forgot Password
  if(page === "forgot-password"){
    return(
     <ForgotPassword onBack={()=> setPage("login")} />
  );
  }

  // Welcome Page
  if (!isLoggedIn) {
    return (
      <>
      <Welcome
        onLogin={() => setPage("login")}
        onRegister={() => setPage("register")}
        onAdminLogin={() => setPage("admin-login")}
        onAdminSetup={() => setPage("admin-setup")}
      />
      <Footer onAdminLogin={() => setPage("admin-login")}/>
    </>
    );
  }

  // My Appointment Page
  if (showMyAppointments) {
    return (
      <>
        <Navbar onLogout={handleLogout}
          onMyAppointments={() => {
          localStorage.setItem("current_view","my-appointments");
          setShowMyAppointments(true);
        }} />

        <MyAppointments
          onBack={() => {localStorage.removeItem("current_view");
            setShowMyAppointments(false)}}
        />
      </>
    );
  }

  if (selectedProfileDoctor) {
  return (
    <>
      <Navbar onLogout={handleLogout}
       onMyAppointments={() => {
          localStorage.setItem("current_view","my-appointments");
          setShowMyAppointments(true);
        }} />

      <DoctorProfile
        doctor={selectedProfileDoctor}
        onBack={() => {
          localStorage.removeItem("current_view");
          localStorage.removeItem("selected_profile_doctor");
          setSelectedProfileDoctor(null)}}
        onBook={(doctor) => {
          localStorage.setItem("selected_appointment_doctor",JSON.stringify(doctor));
          localStorage.setItem("current_view","appointment");
          setSelectedProfileDoctor(null);
          setSelectedDoctor(doctor);
          setShowAppointment(true);
        }}
      />
    </>
  );
}

  // Book Appointment Page
  if (showAppointment) {
    return (
      <>
        <Navbar onLogout={handleLogout} 
         onMyAppointments={() => {
          localStorage.setItem("current_view","my-appointments");
          setShowMyAppointments(true);
        }} />

        <Appointment
          doctor={selectedDoctor}
          onBack={() => {
            localStorage.removeItem("current_view");
            localStorage.removeItem("selected_appointment_doctor");
            setShowAppointment(false);
            setSelectedDoctor(null);
          }}
        />
      </>
    );
  }

  // Main Website
  return (
    <>
      <Navbar onLogout={handleLogout}
       onMyAppointments={() => {
          localStorage.setItem("current_view","my-appointments");
          setShowMyAppointments(true);
        }} /> 

      <main>
       <Hero
          onTalkToAI={() => {
            document
              .getElementById("ai-assistant")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          onBookAppointment={() => {
            document
              .getElementById("doctors")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        />

        <Stats />

       <Services
          onAI={() => {
            document
              .getElementById("ai-assistant")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          onAppointments={() => {
            document
              .getElementById("doctors")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          onDoctors={() => {
            document
              .getElementById("doctors")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        />

       <Departments
          onDepartmentSelect={(department) => {
            setSelectedDepartment(department);

            setTimeout(() => {
              document
                .getElementById("doctors")
                ?.scrollIntoView({ behavior: "smooth" });
            }, 50);
          }}
          onAskAI={() => {
            document
              .getElementById("ai-assistant")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        />

        <Doctors
         selectedDepartment={selectedDepartment}
         onClearDepartment={()=>setSelectedDepartment("")}
         onProfile={(doctor)=> { localStorage.setItem("selected_profile_doctor",JSON.stringify(doctor));
          localStorage.setItem("current_view","doctor-profile");
          setSelectedProfileDoctor(doctor)}}
         onBook={(doctor) => {
          localStorage.setItem("selected_appointment_doctor",JSON.stringify(doctor));
          localStorage.setItem("current_view","appointment");
            setSelectedDoctor(doctor);
            setShowAppointment(true);
          }}
        />

        <About />

        <AI
        onDepartmentSelect={setSelectedDepartment} />

        <Cta
          onBookAppointment={() => {
            document
              .getElementById("doctors")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          onAI={() => {
            document
              .getElementById("ai-assistant")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </main>

      <Footer />
    </>
  );
}

export default App;