const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  } catch (err) {
    console.warn(`[Gemini] Failed to initialize GoogleGenerativeAI: ${err.message}`);
  }
}

const SYSTEM_PROMPT = `
You are CampusConnect AI, an intelligent, empathetic, and knowledgeable university campus assistant.
Your goal is to assist university students and faculty members with:
1. Explaining complex academic and computer science concepts clearly with simple analogies and code examples when appropriate (Data Structures, Algorithms, DBMS, Operating Systems, Computer Networks, AI/ML, Cloud Computing, Full-Stack Web Development).
2. Clarifying university assignments, breaking down problem statements, and proposing methodical approaches without giving direct complete plagiarism-ready answers.
3. Suggesting structured, personalized study plans, revision timetables, and exam preparation tips.
4. Answering general campus life, hostel, library, attendance policy, and academic calendar queries.
5. Summarizing academic notes and lecture presentations into concise, high-yield revision bullet points.

Important Security & Privacy Guidelines:
- Never disclose private student records, passwords, or personal contact info of any other person.
- Maintain a friendly, supportive, and professional tone.
- Format responses cleanly with Markdown headers, bullet points, and code blocks where helpful.
`;

/**
 * Chat query to Gemini Assistant
 */
const askGemini = async (prompt, conversationHistory = [], contextData = {}) => {
  // If API key configured and genAI initialized
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
    try {
      if (!genAI) {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      }
      
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Construct augmented prompt with user context
      let contextualizedPrompt = SYSTEM_PROMPT + '\n\n';
      if (contextData.userRole) {
        contextualizedPrompt += `User Role: ${contextData.userRole}\n`;
      }
      if (contextData.department) {
        contextualizedPrompt += `Department: ${contextData.department}\n`;
      }
      if (contextData.currentSemester) {
        contextualizedPrompt += `Current Semester: ${contextData.currentSemester}\n`;
      }

      if (conversationHistory && conversationHistory.length > 0) {
        contextualizedPrompt += `\nRecent Conversation History:\n`;
        conversationHistory.slice(-4).forEach(msg => {
          contextualizedPrompt += `${msg.sender === 'user' ? 'Student' : 'Assistant'}: ${msg.text}\n`;
        });
      }

      contextualizedPrompt += `\nStudent/User Query: ${prompt}\n\nPlease respond helpfully:`;

      const result = await model.generateContent(contextualizedPrompt);
      const response = await result.response;
      return response.text();
    } catch (err) {
      console.warn(`[Gemini API] Request error, falling back to smart engine: ${err.message}`);
    }
  }

  // Fallback Intelligent Academic Engine (Offline / Demo mode)
  return generateIntelligentFallbackResponse(prompt, contextData);
};

/**
 * Summarize academic materials
 */
const summarizeStudyMaterial = async (title, contentOrSubject) => {
  const prompt = `Please provide a high-yield, structured summary of this study material titled "${title}".
Include:
1. Core Topics Covered
2. Key Concepts & Definitions
3. 3-5 Critical Takeaways for Semester Exams
4. Quick Self-Assessment Quiz (3 questions with brief answers)

Content / Topic Details:
${contentOrSubject}`;

  return askGemini(prompt, [], { task: 'summarization' });
};

/**
 * Generate personalized study schedule based on subjects & attendance
 */
const generateStudySchedule = async (subjects, dailyHoursAvailable = 3) => {
  const subjectList = subjects.map(s => `${s.name || s} (${s.credits || 4} credits)`).join(', ');
  const prompt = `Create a realistic 7-day personalized weekly study schedule for a computer science student.
The student has ${dailyHoursAvailable} hours per day for self-study and is currently taking these courses: ${subjectList}.
Incorporate active recall, spaced repetition, and 1 dedicated project/coding practice session.`;

  return askGemini(prompt, [], { task: 'study_schedule' });
};

/**
 * Fallback response generator with realistic knowledge base
 */
const generateIntelligentFallbackResponse = (prompt, contextData = {}) => {
  const lower = prompt.toLowerCase();

  if (lower.includes('attendance') || lower.includes('shortage') || lower.includes('bunk') || lower.includes('75')) {
    return `### 📊 CampusConnect Attendance Insights & Regulations
- **Mandatory Criterion**: The university regulations require a minimum of **75% attendance** across all enrolled subjects to be eligible for end-semester examinations.
- **Shortage Prediction**: Check your **Smart Attendance Dashboard** widget. Our predictive algorithm calculates exactly how many consecutive classes you must attend to cross 75%.
- **Medical / Duty Leaves**: In case of certified medical emergencies or official university representation, submit a **Leave Request** via the portal with supporting documents to avoid debarment.`;
  }

  if (lower.includes('schedule') || lower.includes('timetable') || lower.includes('plan')) {
    return `### 🗓️ Recommended Personalized 7-Day Study Blueprint
Based on your academic curriculum, here is an optimized daily routine:
- **Monday & Wednesday (90 mins)**: High-concept theory (Operating Systems, DBMS normalization & ACID properties).
- **Tuesday & Thursday (90 mins)**: Problem solving & Data Structures (Trees, Graphs, Dynamic Programming).
- **Friday (60 mins)**: Assignment wrap-up & lab practical code reviews.
- **Saturday (120 mins)**: Mini-project development & Git commits.
- **Sunday (60 mins)**: Spaced repetition flashcards & weekly self-audit.

*Pro-tip: Break your sessions into 25-minute Pomodoro blocks with 5-minute pauses for peak cognitive retention!*`;
  }

  if (lower.includes('assignment') || lower.includes('deadline') || lower.includes('submission')) {
    return `### 📝 Assignment Management & Submission Strategy
1. **Analyze Requirements**: Read the problem statement and rubric carefully on your **Assignments** tab.
2. **Break into Milestones**: Divide large programming or theory assignments into 3 manageable chunks: Architecture design, Implementation, and Verification tests.
3. **Format & Naming**: Export your code/report in PDF, ZIP, or DOCX formats as specified by your faculty.
4. **Anti-Plagiarism Reminder**: Ensure all code comments and explanations are written in your own words.

*Check your Pending Assignments tab to verify remaining hours before due dates.*`;
  }

  if (lower.includes('dsa') || lower.includes('data structure') || lower.includes('algorithm') || lower.includes('tree') || lower.includes('graph')) {
    return `### 💡 Core Data Structures & Algorithms Breakdown
- **Binary Search Trees (BST)**: Offers average $O(\\log n)$ search, insert, and delete. Ensure balancing (AVL or Red-Black Trees) to prevent worst-case $O(n)$ degradation into a linked list.
- **Graph Traversals**:
  - **BFS (Breadth-First Search)**: Uses a Queue. Ideal for shortest path in unweighted graphs.
  - **DFS (Depth-First Search)**: Uses recursion or a Stack. Ideal for cycle detection, topological sorting, and connected components.
- **Dynamic Programming Strategy**: Identify overlapping subproblems and optimal substructure. State the recurrence relation before jumping into tabulation or memoization.`;
  }

  return `### 🎓 CampusConnect Academic Guidance
Thank you for your question! Here are key recommendations regarding **"${prompt}"**:

1. **Structured Approach**: Break down the topic into fundamentals, practical application, and exam relevance.
2. **Campus Resources**: Access faculty lecture notes and recommended textbooks in your **Study Materials** section.
3. **Peer Collaboration & Doubt Clearing**: Attend faculty consultation hours or leave a note on the subject forum.

*Need a detailed breakdown on a specific subject, assignment, or study schedule? Feel free to ask me to explain any topic or generate a timetable!*`;
};

module.exports = {
  askGemini,
  summarizeStudyMaterial,
  generateStudySchedule
};
