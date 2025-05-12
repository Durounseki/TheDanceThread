import ProgressiveImage from "./ProgressiveImage";

const teamMembers = [
  {
    name: "Yasmine Allen",
    role: "Founder",
    pictureKey: "yasmine-allen.jpeg",
  },
  {
    name: "Lisa Holden",
    role: "Digital Marketing",
    pictureKey: "lisa-holden.jpeg",
  },
  {
    name: "Christian Esparza",
    role: "Developer",
    pictureKey: "christian-esparza.jpeg",
  },
];

function TeamMember({ name, role, pictureKey }) {
  return (
    <div className="team-member">
      <div className="member-image">
        <ProgressiveImage imageKey={pictureKey} alt={name} />
      </div>
      <h3 className="member-name">{name}</h3>
      <p className="member-role">{role}</p>
    </div>
  );
}

const About = () => {
  return (
    <section className="about-page">
      <section className="about-description">
        <h1>Connecting the Dance World</h1>
        <p>
          Welcome to <strong>The Dance Thread</strong> – the dedicated digital
          stage for dancers, instructors, and event organizers! We&apos;re
          passionate about fostering a vibrant, interconnected global dance
          community.
        </p>
        <p>
          Our platform is designed to be the central hub for discovering and
          promoting dance events, classes, workshops, and festivals. Whether
          you&apos;re looking for your next social, training opportunity, or
          major event, you&apos;ll find it at The Dance Thread.
        </p>
        <p>
          We&apos;re building towards a future where The Dance Thread is not
          just a listing site, but a comprehensive toolkit for the dance world.
          Soon, organizers will be able to manage their events seamlessly –
          handling ticketing, schedules, attendee lists, and more, all in one
          place. Ultimately, we envision The Dance Thread evolving into a
          dynamic social network, connecting dancers across styles and borders.
        </p>
      </section>

      <section className="team-section team-container">
        <h1>Meet Our Team</h1>
        <div className="team">
          {teamMembers.map((member) => (
            <TeamMember
              pictureKey={member.pictureKey}
              name={member.name}
              role={member.role}
            />
          ))}
        </div>
      </section>

      <section className="join-us-section partners">
        <h1>Join our community</h1>
        <p className="partners-text">
          The Dance Thread is more than just a website; it&apos;s a growing
          movement built by and for the dance community. Explore events, list
          your classes, share your passion, and help us weave a stronger, more
          connected dance world together.
        </p>
      </section>
    </section>
  );
};
export default About;
