import Header from './components/header';
import Navbar from './components/navbar';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Footer from './components/Footer';

export default function App() {
  const studentName = "Neer Patel";
  const mySkills = [
    "React.js & Vite",
    "SQL & MongoDB",
    "PHP & Node.js",
    "Data Structures & Algorithms"
  ];

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header name={studentName} themeColor="#1d4ed8" />
      <NavBar />
      <main style={{ flex: 1 }}>
        <About />
        <Skills skillList={mySkills} />
        <Projects />
      </main>
      <Footer />
    </div>
  );
}