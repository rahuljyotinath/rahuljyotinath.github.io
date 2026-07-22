import SectionReveal from './SectionReveal';
import useBackgroundImage from '../hooks/useBackgroundImage';
import SectionHead from './SectionHead';

export default function TeamSection({ team, heading }) {
  if (!team?.length) return null;

  return (
    <section className="team-section">
      <div className="wrap">
        {heading && <SectionHead eyebrow={heading.eyebrow} headline={heading.headline} />}
        <div className="team-grid">
          {team.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamCard({ member }) {
  const imgRef = useBackgroundImage(member.image);

  return (
    <SectionReveal className="team-card">
      <div className="team-card-media">
        <div className="ph" ref={imgRef} />
      </div>
      <div className="team-card-copy">
        <h3>{member.name}</h3>
        <p className="team-role">{member.role}</p>
        {member.credentials && <p className="team-credentials">{member.credentials}</p>}
        <p>{member.bio}</p>
      </div>
    </SectionReveal>
  );
}
