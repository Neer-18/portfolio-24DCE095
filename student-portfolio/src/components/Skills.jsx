export default function Skills({ skillList }) {
    return (
        <section id="skills" style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
            <h2>Key Technical Skills</h2>
            <ul>
                {skillList.map((skill, index) => (
                    <li key={index} style={{ margin: '0.5rem 0', fontWeight: 'bold' }}>
                        {skill}
                    </li>
                ))}
            </ul>
        </section>
    );
}