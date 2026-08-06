export default function Projects() {
    const projectList = [
        { title: "Monastery360", desc: "A digital heritage platform prototype developed for the Smart India Hackathon." },
        { title: "Real-Time Chat Translator", desc: "A cross-language communication platform built as a Software Group Project." },
        { title: "Banking System Database", desc: "A complex banking simulation utilizing both SQL and MongoDB implementations." }
    ];

    return (
        <section id="projects" style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
            <h2>Recent Projects</h2>
            <ul>
                {projectList.map((proj, idx) => (
                    <li key={idx} style={{ margin: '1rem 0' }}>
                        <strong>{proj.title}</strong>: {proj.desc}
                    </li>
                ))}
            </ul>
        </section>
    );
}