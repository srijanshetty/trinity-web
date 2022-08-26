import Skill from '../interfaces/Skill';

const SkillItem = ({ skill }: { skill: Skill }) => {
  return (
    <div
      key={skill.token_id}
      className='p-2 bg-white rounded-lg'
    >
      <img
        src={skill.token_uri}
      />
    </div>
  );
};

const SkillTable = ({ skills } : { skills: Skill[] }) => {
  return (
    <div className='mt-4 grid grid-cols-2 gap-4'>
      {skills.map((skill) => <SkillItem skill={skill} />)}
    </div>
  );
}

export default SkillTable;
