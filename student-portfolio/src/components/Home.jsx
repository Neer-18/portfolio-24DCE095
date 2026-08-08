import About from './About';
import Skills from './Skills';

export default function Home() {
    const mySkills = [
        "React.js & Vite",
        "SQL & MongoDB",
        "PHP & Node.js",
        "Data Structures & Algorithms"
    ];

    return (
        <div>
            <About />
            <Skills skillList={mySkills} />
        </div>
    );
}