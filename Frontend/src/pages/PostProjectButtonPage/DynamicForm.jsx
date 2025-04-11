import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPaperclip } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { p } from "framer-motion/client";
import { useSelector } from "react-redux";

const defaultCategory = "full stack web site";

const questions = {
  "full stack web site": [
    "What is the main purpose of the website?",
    "Which platform do you want the site to be built on?",
    "What payment methods do you need integrated?",
  ],
};

const options = {
  "What is the main purpose of the website?": [
    "E-commerce",
    "Blog/Content",
    "Portfolio",
    "Other (please specify)",
  ],
  "Which platform do you want the site to be built on?": [
    "Shopify",
    "WooCommerce",
    "Magento",
    "Other (please specify)",
  ],
  "What payment methods do you need integrated?": [
    "Credit/Debit Cards",
    "PayPal",
    "Stripe",
    "Other (please specify)",
  ],
};

export default function DynamicForm() {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [otherInput, setOtherInput] = useState("");
  
  // const skillsList = ["HTML", "PHP", "MySQL", "Web Hosting", "Javascript", "CSS", "React", "Node.js", "Express", "MongoDB", "Python", "Django", "Flask", "Ruby on Rails", "Java", "Spring Boot", "C#", ".NET"];
  const skillsList = useSelector(state => state.general.skills);
  const [skills, setSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    if (description) {
      const keywords = description.toLowerCase().split(/\s+/);
      const matchedSkills = skillsList.filter(skill =>
        keywords.some(keyword => skill.name?.toLowerCase().includes(keyword))
      );
      setSkills(matchedSkills.slice(0, 3));
    }
  }, [description]);

  const handleSkillSelect = skill => {
    if (!skills.includes(skill) && skills.length < 5) {
      setSkills([...skills, skill]);
    }
  };
  
  const handleSkillRemove = skill => {
    setSkills(skills.filter(s => s !== skill));
  };
  
  const handleNext = () => {
    if (step === 0) {
      const matchedCategory = questions[description] ? description : defaultCategory;
      setCategory(matchedCategory);
      setStep(1);
    } else if (category && step < questions[category]?.length) {
      setStep(step + 1);
    } else {
      setSubmitted(true);
    }
  };
  
  const handleChange = e => {
    const value = e.target.value;
    setAnswers({ ...answers, [questions[category][step - 1]]: value });
  };

  const handleOtherChange = e => {
    setOtherInput(e.target.value);
    setAnswers({ ...answers, [questions[category][step - 1]]: e.target.value });
  };
  
  const handleSubmit = () => {
    console.log("Form submitted with answers:", answers);
    setSubmitted(true);
  };
  
 
  
  
  return (
    <motion.div
      className="p-8 max-w-lg mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold">
        Tell us what you need <span className="text-pink-600">done.</span>
      </h1>
      <p className="text-gray-600 mb-4">We'll guide you to create the perfect brief.</p>

      {submitted ? (
        <div>
          <h2>Project Name</h2>
          <input
            type="text"
            className="w-full p-2 border rounded mt-2"
            placeholder="Project name"
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
          />

          <h2 className="mt-4">Project Description</h2>
          <textarea className="w-full p-2 border rounded mt-2" value={description} readOnly />

          <div className="mt-4 p-4 border rounded flex items-center">
            <FaPaperclip className="text-gray-600 mr-2" />
            <span className="text-gray-600">Attach files</span>
          </div>
          <input type="file" className="mt-2" />

          <h2 className="mt-4 font-bold">What skills are required?</h2>
          <input
            type="text"
            className="w-full p-2 border rounded mt-2"
            placeholder="Search and select skills..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <div className="mt-2 bg-gray-100 p-2 rounded shadow-md max-h-40 overflow-y-auto">
            {skillsList
              .filter(skill => skill.name?.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(skill => (
                <button
                  key={skill.id}
                  className="border px-3 py-1 rounded bg-white shadow hover:bg-gray-200 transition m-1"
                  onClick={() => handleSkillSelect(skill)}
                >
                  {skill.name}
                </button>
              ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {skills.map(skill => (
              <div key={skill.id} className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                {skill.name}
                <IoClose className="ml-2 cursor-pointer" onClick={() => handleSkillRemove(skill)} />
              </div>
            ))}
          </div>
          <p className="mt-2">{skills.length}/5 selected</p>

          <div className="flex justify-end mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-full text-white font-semibold transition-all duration-300 bg-pink-500 hover:bg-pink-600 shadow-lg"
              onClick={() => navigate("/PaymentAndBudget" , { state :
                {
                projectName,
                description,
                answers,
                skills,
              },
            })}
            >
              Next
            </motion.button>
          </div>
        </div>
      ) : (
        <motion.div
          key={step}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {step === 0 ? (
            <div>
              <textarea
                className="w-full p-2 border rounded"
                placeholder="Enter a few bullet points or a full description."
                value={description}
                onChange={e => setDescription(e.target.value)}
              />

              {description.trim() && (
                <div className="flex justify-end mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 rounded-full text-white font-semibold transition-all duration-300 bg-pink-500 hover:bg-pink-600 shadow-lg"
                    onClick={handleNext}
                  >
                    Next
                  </motion.button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold">{questions[category][step - 1]}</h2>
              <div className="mt-2 space-y-2">
                {options[questions[category][step - 1]]?.map(option => (
                  <motion.label key={option} className="block border p-2 rounded cursor-pointer">
                    <input type="radio" name="answer" value={option} onChange={handleChange} /> {option}
                  </motion.label>
                ))}
              </div>

              <div className="flex justify-end mt-4">
                <motion.button className="bg-pink-600 text-white px-4 py-2 rounded" onClick={handleNext}>
                  Next
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
